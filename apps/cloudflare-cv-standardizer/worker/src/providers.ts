import type { CreateJobOptions, CVData, JobRecord } from './types';

export async function transformCvText(params: {
  job: JobRecord;
  options: Pick<CreateJobOptions, 'apiKey' | 'providerBaseUrl'>;
  fallbackOpenAiKey?: string;
  defaultOllamaBaseUrl: string;
  extractedText: string;
}): Promise<CVData> {
  if (params.job.provider === 'openai') {
    return transformWithOpenAi(params);
  }

  if (params.job.provider === 'ollama') {
    return transformWithOllama(params);
  }

  return heuristicTransform(params.job, params.extractedText);
}

async function transformWithOpenAi(params: {
  job: JobRecord;
  options: Pick<CreateJobOptions, 'apiKey'>;
  fallbackOpenAiKey?: string;
  extractedText: string;
}): Promise<CVData> {
  const apiKey = params.options.apiKey || params.fallbackOpenAiKey;
  if (!apiKey) {
    return heuristicTransform(params.job, params.extractedText, 'OpenAI API key missing, used heuristic fallback.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: params.job.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(params.job.outputLanguage) },
        { role: 'user', content: params.extractedText }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    return heuristicTransform(params.job, params.extractedText, `OpenAI HTTP ${response.status}: ${message.slice(0, 300)}`);
  }

  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return normalizeProviderJson(params.job, payload.choices?.[0]?.message?.content, params.extractedText);
}

async function transformWithOllama(params: {
  job: JobRecord;
  options: Pick<CreateJobOptions, 'providerBaseUrl'>;
  defaultOllamaBaseUrl: string;
  extractedText: string;
}): Promise<CVData> {
  const baseUrl = (params.options.providerBaseUrl || params.defaultOllamaBaseUrl).replace(/\/+$/, '');
  if (!baseUrl) {
    return heuristicTransform(params.job, params.extractedText, 'Ollama base URL missing, used heuristic fallback.');
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: params.job.model,
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: buildSystemPrompt(params.job.outputLanguage) },
        { role: 'user', content: params.extractedText }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    return heuristicTransform(params.job, params.extractedText, `Ollama HTTP ${response.status}: ${message.slice(0, 300)}`);
  }

  const payload = await response.json() as { message?: { content?: string }, response?: string };
  return normalizeProviderJson(params.job, payload.message?.content || payload.response, params.extractedText);
}

function normalizeProviderJson(job: JobRecord, content: string | undefined, fallbackText: string): CVData {
  if (!content) {
    return heuristicTransform(job, fallbackText, 'Provider returned an empty response.');
  }

  try {
    const parsed = JSON.parse(extractJsonObject(content)) as Partial<CVData>;
    if (!hasUsefulCvData(parsed)) {
      return heuristicTransform(job, fallbackText, 'Provider returned no usable CV content. Used heuristic fallback.');
    }

    return anonymizeIfNeeded({
      ...emptyCv(job),
      ...parsed,
      contact: normalizeContact(parsed.contact, fallbackText),
      meta: {
        ...emptyCv(job).meta,
        ...parsed.meta,
        provider: job.provider,
        model: job.model,
        sourceFileName: job.inputFileName,
        outputFormat: job.outputFormat,
        outputLanguage: job.outputLanguage,
        templateStyle: job.templateStyle,
        anonymized: job.anonymizeCandidateName,
        processedAt: new Date().toISOString()
      }
    }, job);
  } catch {
    return heuristicTransform(job, fallbackText, 'Provider did not return valid JSON.');
  }
}

function hasUsefulCvData(cv: Partial<CVData>): boolean {
  return Boolean(
    cv.title?.trim()
    || cv.summaryLines?.some((line) => line.trim())
    || cv.keyExpertise?.some((skill) => skill.trim())
    || Object.values(cv.technicalSkills || {}).some((skills) => skills.some((skill) => skill.trim()))
    || cv.experiences?.length
    || cv.education?.length
    || cv.certifications?.length
  );
}

function heuristicTransform(job: JobRecord, text: string, warning?: string): CVData {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const likelyName = inferName(lines, job.inputFileName);
  const skills = inferSkills(text);
  const summary = inferSummary(lines);
  const localizedWarning = warning ? localizeWarning(warning, job.outputLanguage) : undefined;
  const localized = localizeHeuristicData(job, {
    fullName: likelyName,
    title: inferTitle(lines),
    summaryLines: localizedWarning ? [localizedWarning, ...summary].slice(0, 5) : summary,
    keyExpertise: skills.slice(0, 12),
    technicalSkills: {
      core: skills.slice(0, 10),
      tools: skills.slice(10, 20)
    },
    experiences: inferExperiences(lines),
    education: inferSectionItems(lines, /^formation$/i, /^(formations? et certifications|comp[eé]tences|langues|centres d.?int[eé]r[eê]t)/i),
    languages: inferSectionItems(lines, /^langues$/i, /^(centres d.?int[eé]r[eê]t|comp[eé]tences|formations?)/i),
    certifications: inferSectionItems(lines, /^formations? et certifications$/i, /^(comp[eé]tences|langues|centres d.?int[eé]r[eê]t)/i)
  });

  return anonymizeIfNeeded({
    ...emptyCv(job),
    ...localized,
    contact: inferContact(text, lines),
    rawSections: {
      extractedText: text.slice(0, 12000)
    }
  }, job);
}

function emptyCv(job: JobRecord): CVData {
  return {
    schemaVersion: 'cloudflare-worker-0.2',
    fullName: localizedDefault(job, 'Candidate', 'Candidat'),
    contact: {
      email: '',
      phone: '',
      address: ''
    },
    title: 'Consultant',
    summaryLines: [],
    keyExpertise: [],
    technicalSkills: {},
    experiences: [],
    education: [],
    languages: [],
    certifications: [],
    rawSections: {},
    meta: {
      provider: job.provider,
      model: job.model,
      sourceFileName: job.inputFileName,
      outputFormat: job.outputFormat,
      outputLanguage: job.outputLanguage,
      templateStyle: job.templateStyle,
      anonymized: job.anonymizeCandidateName,
      processedAt: new Date().toISOString()
    }
  };
}

function localizeHeuristicData(job: JobRecord, data: Pick<CVData, 'fullName' | 'title' | 'summaryLines' | 'keyExpertise' | 'technicalSkills' | 'experiences' | 'education' | 'languages' | 'certifications'>): Pick<CVData, 'fullName' | 'title' | 'summaryLines' | 'keyExpertise' | 'technicalSkills' | 'experiences' | 'education' | 'languages' | 'certifications'> {
  if (job.outputLanguage !== 'fr') {
    return {
      ...data,
      technicalSkills: {
        core: data.technicalSkills.core || [],
        tools: data.technicalSkills.tools || []
      }
    };
  }

  return {
    ...data,
    technicalSkills: {
      principales: data.technicalSkills.core || [],
      outils: data.technicalSkills.tools || []
    },
    experiences: data.experiences.map((experience) => ({
      ...experience,
      sector: translateGenericValue(experience.sector, job.outputLanguage),
      context: translateGenericValue(experience.context, job.outputLanguage),
      achievements: experience.achievements.map((line) => translateGenericValue(line, job.outputLanguage))
    })),
    languages: data.languages.map((line) => translateGenericValue(line, job.outputLanguage))
  };
}

function localizeWarning(warning: string, language: JobRecord['outputLanguage']): string {
  if (language !== 'fr') {
    return warning;
  }

  if (warning.includes('Provider did not return valid JSON')) return 'Le fournisseur IA n’a pas retourné un JSON valide. Fallback générique utilisé.';
  if (warning.includes('Provider returned no usable CV content')) return 'Le fournisseur IA n’a pas retourné de contenu CV exploitable. Fallback générique utilisé.';
  if (warning.includes('Provider returned an empty response')) return 'Le fournisseur IA a retourné une réponse vide. Fallback générique utilisé.';
  if (warning.includes('OpenAI API key missing')) return 'Clé API OpenAI manquante. Fallback générique utilisé.';
  if (warning.includes('Ollama base URL missing')) return 'URL Ollama manquante. Fallback générique utilisé.';
  return warning;
}

function translateGenericValue(value: string, language: JobRecord['outputLanguage']): string {
  if (language !== 'fr') {
    return value;
  }

  return value
    .replace(/\bLuxury retail\b/gi, 'Luxe / retail')
    .replace(/\bBanking\b/gi, 'Banque')
    .replace(/\bInsurance\b/gi, 'Assurance')
    .replace(/\bEnglish:\s*Fluent\b/gi, 'Anglais : Courant')
    .replace(/\bFrench:\s*Native\b/gi, 'Français : Langue maternelle')
    .replace(/\bShared on request\b/gi, 'Partagé sur demande')
    .replace(/\bPresent\b/gi, 'Aujourd’hui');
}

function localizedDefault(job: JobRecord, english: string, french: string): string {
  return job.outputLanguage === 'fr' ? french : english;
}

function inferName(lines: string[], fileName: string): string {
  const ignored = /^(profil|profile|contact|snapshot|expertise|formation|education|langues|languages|comp[eé]tences|skills|certifications?|exp[eé]riences?)/i;
  const initialName = lines.find((line) => /^(?:[A-ZÀ-Ý]\.\s*){2,5}$/.test(line));
  if (initialName) {
    return initialName;
  }

  const firstHumanLine = lines.find((line) => !ignored.test(line) && /^[A-ZÀ-ÿ][A-Za-zÀ-ÿ' .-]{3,80}$/.test(line));
  return firstHumanLine || fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
}

function inferContact(text: string, lines: string[]): CVData['contact'] {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone = lines
    .map((line) => line.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,5}\d{2,4}/)?.[0]?.trim() || '')
    .find(Boolean) || '';
  const address = lines.find((line) => /\b(?:rue|avenue|boulevard|street|road|route|place|drive|lane|city|zip|postal|luxembourg|paris|france|belgium|belgique)\b/i.test(line) && line.length < 180) || '';
  return { email, phone, address };
}

function normalizeContact(contact: Partial<CVData['contact']> | undefined, fallbackText: string): CVData['contact'] {
  const fallbackLines = fallbackText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const inferred = inferContact(fallbackText, fallbackLines);
  return {
    email: stringOrEmpty(contact?.email) || inferred.email,
    phone: stringOrEmpty(contact?.phone) || inferred.phone,
    address: stringOrEmpty(contact?.address) || inferred.address
  };
}

function stringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function inferTitle(lines: string[]): string {
  const ignored = /^(profil|exp[eé]riences?|formation|langues|comp[eé]tences|certifications?)$/i;
  const candidate = lines.slice(0, 8).find((line, index) => index > 0 && !ignored.test(line) && line.length <= 100);
  return candidate || lines.find((line) => /architect|engineer|consultant|developer|manager|analyst|security|cloud|data steward|chef de projet/i.test(line)) || 'Consultant';
}

function inferSkills(text: string): string[] {
  const candidates = [
    'Azure', 'AWS', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'IAM', 'Security', 'DevOps',
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'API', 'Cloudflare',
    'OpenAI', 'Ollama', 'Compliance', 'ISO 27001', 'SOC', 'Linux', 'Networking',
    'Data Governance', 'Data Quality', 'Data Stewardship', 'Data Catalog', 'Data Lineage',
    'Dataiku', 'Power BI', 'BigQuery', 'Informatica', 'Denodo', 'Talend', 'Kafka',
    'Collibra', 'Data Galaxy', 'SAS', 'Qlik Sense', 'Tableau', 'Airflow', 'MDM',
    'GDPR', 'RGPD', 'PIPL', 'BCBS 239', 'Scrum', 'Jira', 'Confluence'
  ];

  return candidates.filter((candidate) => new RegExp(`\\b${escapeRegExp(candidate)}\\b`, 'i').test(text));
}

function inferSummary(lines: string[]): string[] {
  const start = lines.findIndex((line) => /^profil$/i.test(line));
  const end = lines.findIndex((line, index) => index > start && /^exp[eé]riences?\s+professionnelles?/i.test(line));
  const source = start >= 0 ? lines.slice(start + 1, end > start ? end : start + 7) : lines.slice(1, 5);
  return mergeWrappedLines(source)
    .filter((line) => line.length > 30)
    .slice(0, 4);
}

function inferExperiences(lines: string[]): CVData['experiences'] {
  const start = lines.findIndex((line) => /^exp[eé]riences?\s+professionnelles?/i.test(line));
  const end = lines.findIndex((line, index) => index > start && /^formation$/i.test(line));
  if (start < 0) {
    return [];
  }

  const source = lines.slice(start + 1, end > start ? end : undefined);
  const headingIndexes = source
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => isExperienceHeading(line))
    .map(({ index }) => index);

  return headingIndexes.slice(0, 8).map((headingIndex, position) => {
    const nextHeadingIndex = headingIndexes[position + 1] ?? source.length;
    const block = source.slice(headingIndex, nextHeadingIndex);
    const heading = block[0] || 'Experience';
    const dates = block.find((line) => /(janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre|\d{4}|today|present|aujourd)/i.test(line)) || '';
    const achievements = mergeWrappedLines(block.slice(1))
      .filter((line) => line.length > 45 && !line.includes(''))
      .slice(0, 8);

    return {
      title: heading,
      sector: inferSector(heading),
      role: heading,
      context: achievements[0] || '',
      achievements: achievements.slice(1, 6),
      results: [],
      dates
    };
  });
}

function isExperienceHeading(line: string): boolean {
  return /[–-]/.test(line)
    && /(data|consultant|analyste|architect|gouvernance|governance|quality|qualit[eé]|assurances?|banque|couture|engineer|steward)/i.test(line)
    && line.length < 180;
}

function inferSector(value: string): string {
  if (/banque|bank|credit|retail/i.test(value)) return 'Banking';
  if (/assurance|insurance/i.test(value)) return 'Insurance';
  if (/dior|couture|luxe|retail/i.test(value)) return 'Luxury retail';
  return '';
}

function inferSectionItems(lines: string[], startPattern: RegExp, endPattern: RegExp): string[] {
  const start = lines.findIndex((line) => startPattern.test(line));
  if (start < 0) {
    return [];
  }

  const end = lines.findIndex((line, index) => index > start && endPattern.test(line));
  return mergeWrappedLines(lines.slice(start + 1, end > start ? end : start + 10))
    .filter((line) => line.length > 3 && line !== '•')
    .slice(0, 8);
}

function mergeWrappedLines(lines: string[]): string[] {
  const merged: string[] = [];
  for (const line of lines.map((value) => value.replace(/^•\s*/, '').trim()).filter(Boolean)) {
    const previous = merged[merged.length - 1] || '';
    if (previous && !/[.!?:;)]$/.test(previous) && !isExperienceHeading(line) && line.length < 120) {
      merged[merged.length - 1] = `${previous} ${line}`;
    } else {
      merged.push(line);
    }
  }
  return merged;
}

function buildSystemPrompt(language: string): string {
  const outputLanguage = language === 'fr' ? 'French' : 'English';
  return [
    `You standardize CVs into structured JSON in ${outputLanguage}.`,
    'Return only valid JSON. Do not include markdown, comments, explanations, or text outside the JSON object.',
    'If information is missing, use an empty string or an empty array, but preserve every detected experience and skill.',
    'When available, extract candidate contact details into contact.email, contact.phone, and contact.address.',
    'Match this shape:',
    '{"schemaVersion":"string","fullName":"string","contact":{"email":"string","phone":"string","address":"string"},"title":"string","summaryLines":["string"],"keyExpertise":["string"],"technicalSkills":{"category":["skill"]},"experiences":[{"title":"string","sector":"string","role":"string","context":"string","achievements":["string"],"results":["string"],"dates":"string"}],"education":["string"],"languages":["string"],"certifications":["string"],"rawSections":{},"meta":{}}'
  ].join('\n');
}

function extractJsonObject(content: string): string {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  return start >= 0 && end > start ? content.slice(start, end + 1) : content;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function anonymizeIfNeeded(cv: CVData, job: JobRecord): CVData {
  if (!job.anonymizeCandidateName) {
    return cv;
  }

  const detectedName = inferName(
    String(cv.rawSections.extractedText || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    job.inputFileName
  );
  const originalName = cv.fullName || detectedName;
  const alias = anonymizedAlias(job, originalName);
  const contact = anonymizedContact(job);
  const redactions = uniqueRedactions([
    { value: detectedName, replacement: alias },
    { value: originalName, replacement: alias },
    { value: cv.contact.email, replacement: contact.email },
    { value: cv.contact.phone, replacement: contact.phone },
    { value: cv.contact.address, replacement: contact.address }
  ]);

  return {
    ...cv,
    fullName: alias,
    contact,
    rawSections: Object.fromEntries(
      Object.entries(cv.rawSections).map(([key, value]) => [key, redactSensitiveText(value, redactions)])
    )
  };
}

function anonymizedAlias(job: JobRecord, sourceName?: string): string {
  const initials = candidateInitials(sourceName || job.inputFileName);
  const sequence = job.jobId.replace(/^job_/, '').replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase() || '0001';
  return `${initials}-${sequence}`;
}

function candidateInitials(value: string): string {
  const ignored = /^(?:cv|resume|mr|mrs|ms|mme|mlle|monsieur|madame|m|dr|prof|consulting|standardise|standardized)$/i;
  const words = value
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-zÀ-ÿ]/g, ''))
    .filter((part) => part.length > 1 && !ignored.test(part));
  const initials = words.slice(0, 4).map((part) => part[0]?.toUpperCase()).join('');
  return initials || 'CV';
}

function anonymizedContact(job: JobRecord): CVData['contact'] {
  if (job.outputLanguage === 'fr') {
    return {
      email: 'Email masqué',
      phone: 'Téléphone masqué',
      address: 'Adresse masquée'
    };
  }

  return {
    email: 'Email withheld',
    phone: 'Phone withheld',
    address: 'Address withheld'
  };
}

function uniqueRedactions(redactions: Array<{ value: string; replacement: string }>): Array<{ value: string; replacement: string }> {
  const seen = new Set<string>();
  return redactions.filter((redaction) => {
    const key = redaction.value.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function redactSensitiveText(value: string, redactions: Array<{ value: string; replacement: string }>): string {
  return redactions.reduce((current, redaction) => {
    if (!redaction.value.trim()) {
      return current;
    }

    return current.replace(new RegExp(escapeRegExp(redaction.value), 'gi'), redaction.replacement);
  }, value);
}
