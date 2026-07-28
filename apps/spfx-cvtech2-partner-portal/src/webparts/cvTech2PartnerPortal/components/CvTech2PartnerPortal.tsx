import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SPHttpClient } from '@microsoft/sp-http';
import type { ICvTech2PartnerPortalWebPartProps, PartnerPortalTemplate } from '../CvTech2PartnerPortalWebPart';
import {
  IPartnerCvInput,
  IPartnerCvListItem,
  IPartnerMissionItem,
  ISharePointCvDocumentItem,
  SharePointPartnerPortalService
} from '../services/SharePointPartnerPortalService';

interface Props {
  webPartProps: ICvTech2PartnerPortalWebPartProps;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  userDisplayName: string;
  userEmail: string;
}

interface CandidateProfile {
  id: string;
  title: string;
  meta: string;
  seniority: string;
  availability: string;
  skills: string[];
  summary: string;
  cvUrl?: string;
  score?: number;
}

interface CvPreview {
  title: string;
  url: string;
}

type IconName =
  | 'arrowRight'
  | 'bank'
  | 'bell'
  | 'brandMark'
  | 'briefcase'
  | 'bookmark'
  | 'box'
  | 'card'
  | 'check'
  | 'chevronDown'
  | 'clock'
  | 'cloudUpload'
  | 'code'
  | 'database'
  | 'document'
  | 'documentImage'
  | 'gear'
  | 'globe'
  | 'history'
  | 'lightbulb'
  | 'lock'
  | 'moreVertical'
  | 'plus'
  | 'refresh'
  | 'shield'
  | 'search'
  | 'share'
  | 'signal'
  | 'sparkle'
  | 'trend'
  | 'user';

const suggestedSkills = [
  'Azure',
  'GCP',
  'AWS',
  'Terraform',
  'IAM',
  'Kubernetes',
  'Cybersecurity',
  'Compliance',
  'DevSecOps',
  'Landing Zone'
];

const plans = [
  {
    name: 'Starter',
    price: 'EUR 490',
    detail: 'Low-volume partner sourcing.',
    features: ['50 searches / month', '3 reveal requests', 'Email support']
  },
  {
    name: 'Partner Pro',
    price: 'EUR 1,290',
    detail: 'Recurring mission pipelines.',
    features: ['Unlimited anonymized searches', '15 reveal requests', 'Saved mission briefs'],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'Governed access at scale.',
    features: ['SSO / Entra ID', 'Approval workflow', 'Audit retention']
  }
];

type SectionId = 'overview' | 'cv-library' | 'mission-match' | 'plans' | 'compliance' | 'administration';

const navItems: Array<{ id: SectionId; label: string; defaultOrder: number }> = [
  { id: 'overview', label: 'Overview', defaultOrder: 1 },
  { id: 'mission-match', label: 'Mission Match', defaultOrder: 2 },
  { id: 'cv-library', label: 'CV Library', defaultOrder: 3 },
  { id: 'plans', label: 'Plans', defaultOrder: 4 },
  { id: 'compliance', label: 'Compliance', defaultOrder: 5 },
  { id: 'administration', label: 'Administration', defaultOrder: 99 }
];

const skillSynonyms = [
  'Azure',
  'GCP',
  'AWS',
  'Terraform',
  'IAM',
  'Kubernetes',
  'Cybersecurity',
  'Compliance',
  'DevSecOps',
  'Landing Zone',
  'Cloud Security',
  'Zero Trust',
  'Network',
  'SOC',
  'SIEM',
  'M365',
  'SharePoint',
  'Power Platform',
  'Java',
  'React',
  'Node',
  'Python',
  'Data',
  'AI',
  'PMO',
  'Agile'
];

function scoreProfile(profile: CandidateProfile, selectedSkills: string[]): number {
  const matches = selectedSkills.filter((skill) =>
    profile.skills.some((profileSkill) => profileSkill.toLowerCase() === skill.toLowerCase())
  ).length;

  return Math.min(99, 62 + matches * 9);
}

function buildSearchSkills(selectedSkills: string[], missionBrief: string): string[] {
  return Array.from(new Set([...selectedSkills, ...inferSkillsFromText(missionBrief)]))
    .filter((skill) => skill !== 'General IT Consulting');
}

function getSkillIcon(skill: string): IconName {
  const normalized = skill.toLowerCase();
  if (normalized.includes('java') || normalized.includes('terraform') || normalized.includes('kubernetes')) return 'code';
  if (normalized.includes('kafka') || normalized.includes('devsecops')) return 'share';
  if (normalized.includes('french') || normalized.includes('aws') || normalized.includes('azure') || normalized.includes('gcp')) return 'globe';
  if (normalized.includes('bank') || normalized.includes('compliance') || normalized.includes('iam')) return 'bank';
  if (normalized.includes('year') || normalized.includes('senior') || normalized.includes('lead') || normalized.includes('architect')) return 'clock';
  return 'sparkle';
}

function getSectionIcon(sectionId: SectionId): IconName {
  switch (sectionId) {
    case 'overview':
      return 'documentImage';
    case 'mission-match':
      return 'search';
    case 'cv-library':
      return 'document';
    case 'plans':
      return 'card';
    case 'compliance':
      return 'shield';
    case 'administration':
      return 'gear';
    default:
      return 'box';
  }
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist/build/pdf');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: { str?: string }) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) pageTexts.push(pageText);
  }

  return pageTexts.join('\n\n');
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractMissionBriefFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File is too large. Please upload a PDF, DOCX, or TXT file under 10MB.');
  }

  if (extension === 'txt') return file.text();
  if (extension === 'pdf') return extractPdfText(file);
  if (extension === 'docx') return extractDocxText(file);

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT mission brief.');
}

type LayoutMode = 'desktop' | 'tablet' | 'mobile';

interface TemplateTokens {
  navigation: 'side' | 'top';
  shellBackground: string;
  sidebarBackground: string;
  sidebarTextColor: string;
  sidebarMutedColor: string;
  sidebarRadius: number | string;
  sidebarShadow: string;
  navTextColor: string;
  navActiveBackground: string;
  navActiveTextColor: string;
  sidePanelBackground: string;
  cardBackground: string;
  panelBackground: string;
  cardBorder: string;
  cardShadow: string;
  mutedTextColor: string;
  fontFamily: string;
  heroColumns: (metricMinWidth: number, sectionGap: number) => string;
  cardRadius: (borderRadius: number) => number;
}

function mapSharePointCv(item: IPartnerCvListItem): CandidateProfile {
  return {
    id: item.CandidateId || `CV-${item.Id}`,
    title: item.ProfileTitle || item.Title || 'Anonymized candidate',
    meta: [
      item.Seniority || 'Unspecified seniority',
      item.Availability || 'Availability to confirm'
    ].join(' | '),
    seniority: item.Seniority || '',
    availability: item.Availability || '',
    skills: splitSkills(item.Skills || ''),
    summary: item.Summary || 'No summary available yet.',
    cvUrl: item.CvUrl?.Url
  };
}

function splitSkills(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getMonthKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

function formatMissionDate(value?: string): string {
  if (!value) return 'Date unavailable';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function cleanProfileTitle(value: string): string {
  const withoutExtension = value.replace(/\.(pdf|docx)$/i, '');
  return withoutExtension
    .replace(/[_-]+/g, ' ')
    .replace(/\b(cv|resume|anonymous|anonymized|standardise|standardized|v\d+(\.\d+)*)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Anonymized consultant';
}

function inferSkillsFromText(value: string): string[] {
  const lower = value.toLowerCase();
  const skills = skillSynonyms.filter((skill) => lower.includes(skill.toLowerCase()));
  return Array.from(new Set(skills.length ? skills : ['General IT Consulting']));
}

function inferSeniority(value: string): string {
  const lower = value.toLowerCase();
  if (/\b(architect|principal)\b/.test(lower)) return 'Architect';
  if (/\b(lead|manager|head)\b/.test(lower)) return 'Lead';
  if (/\b(senior|sr)\b/.test(lower)) return 'Senior';
  if (/\b(junior|jr)\b/.test(lower)) return 'Junior';
  return 'Senior';
}

function buildAbsoluteSharePointUrl(siteUrl: string, document: ISharePointCvDocumentItem): string {
  if (document.File?.LinkingUrl) return document.File.LinkingUrl;
  const serverRelativeUrl = document.File?.ServerRelativeUrl || '';
  if (!serverRelativeUrl) return siteUrl;
  return `${new URL(siteUrl).origin}${serverRelativeUrl}`;
}

function mapDocumentToPartnerCv(siteUrl: string, document: ISharePointCvDocumentItem): IPartnerCvInput {
  const fileName = document.File?.Name || document.Title || `CV document ${document.Id}`;
  const profileTitle = cleanProfileTitle(document.Title || fileName);
  const skills = inferSkillsFromText(`${profileTitle} ${fileName}`);
  const cvUrl = buildAbsoluteSharePointUrl(siteUrl, document);

  return {
    title: profileTitle,
    candidateId: `DOC-${document.Id}`,
    profileTitle,
    seniority: inferSeniority(`${profileTitle} ${fileName}`),
    availability: 'Availability to confirm',
    skills,
    summary: `Anonymized profile imported from SharePoint document "${fileName}". Initial metadata was inferred from the document name and library metadata.`,
    cvUrl,
    cvUrlDescription: fileName
  };
}

function filterProfiles(sourceProfiles: CandidateProfile[], selectedSkills: string[], seniority: string, availability: string): CandidateProfile[] {
  const normalizedSkills = selectedSkills.map((skill) => skill.toLowerCase());

  return sourceProfiles
    .filter((profile) => !seniority || profile.seniority === seniority)
    .filter((profile) => !availability || profile.availability === availability)
    .filter((profile) => {
      if (normalizedSkills.length === 0) return true;

      const searchableProfile = `${profile.title} ${profile.meta} ${profile.summary} ${profile.skills.join(' ')}`.toLowerCase();
      return normalizedSkills.some((skill) => searchableProfile.includes(skill));
    })
    .map((profile) => ({
      ...profile,
      score: scoreProfile(profile, selectedSkills)
    }))
    .sort((left, right) => (right.score || 0) - (left.score || 0));
}

export default function CvTech2PartnerPortal({ webPartProps, spHttpClient, siteUrl, userDisplayName, userEmail }: Props): JSX.Element {
  const {
    portalTemplate,
    brandLabel,
    portalTitle,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    partnerMonthlyQuota,
    overviewPosition,
    missionMatchPosition,
    cvLibraryPosition,
    plansPosition,
    compliancePosition
  } = webPartProps;

  const rootRef = useRef<HTMLDivElement>(null);
  const missionBriefInputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef(new SharePointPartnerPortalService(spHttpClient, siteUrl));
  const [containerWidth, setContainerWidth] = useState(webPartMaxWidth);
  const [missionBrief, setMissionBrief] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Azure', 'IAM', 'Terraform']);
  const [seniority, setSeniority] = useState('');
  const [availability, setAvailability] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [availableProfiles, setAvailableProfiles] = useState<CandidateProfile[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(true);
  const [dataError, setDataError] = useState('');
  const [missionError, setMissionError] = useState('');
  const [partnerMissions, setPartnerMissions] = useState<IPartnerMissionItem[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [adminError, setAdminError] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [isImportingDocuments, setIsImportingDocuments] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchesRemaining, setSearchesRemaining] = useState(partnerMonthlyQuota);
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [activeMissionMenuId, setActiveMissionMenuId] = useState<number | undefined>();
  const [editingMissionId, setEditingMissionId] = useState<number | undefined>();
  const [isSavingMission, setIsSavingMission] = useState(false);
  const [isImportingMissionBrief, setIsImportingMissionBrief] = useState(false);
  const [cvPreview, setCvPreview] = useState<CvPreview | undefined>();

  useEffect(() => {
    serviceRef.current = new SharePointPartnerPortalService(spHttpClient, siteUrl);
  }, [siteUrl, spHttpClient]);

  useEffect(() => {
    const measure = (): void => {
      const width = rootRef.current?.getBoundingClientRect().width;
      if (width) setContainerWidth(width);
    };

    measure();

    if (typeof ResizeObserver !== 'undefined' && rootRef.current) {
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(rootRef.current);
      return () => resizeObserver.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCvs(): Promise<void> {
      setIsLoadingCvs(true);
      setDataError('');

      try {
        const items = await serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit);
        if (!isMounted) return;
        setAvailableProfiles(items.map(mapSharePointCv));
      } catch (error) {
        if (!isMounted) return;
        setDataError(error instanceof Error ? error.message : 'Unable to load CVs from SharePoint.');
        setAvailableProfiles([]);
      } finally {
        if (isMounted) setIsLoadingCvs(false);
      }
    }

    loadCvs().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [webPartProps.cvListTitle, webPartProps.cvRowLimit]);

  const loadPartnerMissions = async (): Promise<void> => {
    setIsLoadingMissions(true);
    setMissionError('');

    try {
      const missions = await serviceRef.current.getPartnerMissions(
        webPartProps.missionListTitle,
        webPartProps.partnerName,
        100
      );
      setPartnerMissions(missions);
    } catch (error) {
      setMissionError(error instanceof Error ? error.message : 'Unable to load partner missions from SharePoint.');
      setPartnerMissions([]);
    } finally {
      setIsLoadingMissions(false);
    }
  };

  useEffect(() => {
    loadPartnerMissions().catch(() => undefined);
  }, [webPartProps.missionListTitle, webPartProps.partnerName]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess(): Promise<void> {
      setIsCheckingAdmin(true);
      setAdminError('');

      try {
        const hasAccess = await serviceRef.current.isPartnerPortalAdmin(webPartProps.adminListTitle, userEmail);
        if (!isMounted) return;
        setIsAdmin(hasAccess);
        if (!hasAccess && activeSection === 'administration') {
          setActiveSection('overview');
        }
      } catch (error) {
        if (!isMounted) return;
        setIsAdmin(false);
        setAdminError(error instanceof Error ? error.message : 'Unable to check Partner Portal admin access.');
      } finally {
        if (isMounted) setIsCheckingAdmin(false);
      }
    }

    checkAdminAccess().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [activeSection, userEmail, webPartProps.adminListTitle]);

  const searchSkills = useMemo(() => buildSearchSkills(selectedSkills, missionBrief), [missionBrief, selectedSkills]);

  const searchCriteria = useMemo(() => {
    return [
      ...searchSkills.map((skill) => `Skill: ${skill}`),
      seniority ? `Seniority: ${seniority}` : 'Seniority: Any',
      availability ? `Availability: ${availability}` : 'Availability: Any',
      missionBrief.trim() ? 'Mission brief: included' : 'Mission brief: empty'
    ];
  }, [availability, missionBrief, searchSkills, seniority]);

  const visibleMissions = useMemo(() => showAllMissions ? partnerMissions : partnerMissions.slice(0, 3), [partnerMissions, showAllMissions]);

  const rankedProfiles = useMemo(() => {
    return filterProfiles(availableProfiles, searchSkills, seniority, availability);
  }, [availability, availableProfiles, searchSkills, seniority]);

  const toggleSkill = (skill: string): void => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const addSkill = (): void => {
    const value = skillInput.trim();
    if (!value) return;

    setSelectedSkills((current) => current.includes(value) ? current : [...current, value]);
    setSkillInput('');
  };

  const startNewMission = (): void => {
    setMissionBrief('');
    setSelectedSkills([]);
    setSkillInput('');
    setSeniority('');
    setAvailability('');
    setEditingMissionId(undefined);
    setActiveMissionMenuId(undefined);
    setSearchStatus('New mission ready. Add a brief or criteria to launch a search.');
  };

  const importMissionBriefFile = async (file: File): Promise<void> => {
    setIsImportingMissionBrief(true);
    setSearchStatus(`Importing mission brief from "${file.name}"...`);

    try {
      const extractedText = (await extractMissionBriefFromFile(file)).trim();
      if (!extractedText) {
        throw new Error(`No readable text was found in "${file.name}".`);
      }

      const extractedSkills = inferSkillsFromText(extractedText).filter((skill) => skill !== 'General IT Consulting');
      setMissionBrief(extractedText);
      setSelectedSkills((current) => Array.from(new Set([...current, ...extractedSkills])));
      setEditingMissionId(undefined);
      setActiveMissionMenuId(undefined);
      setSearchStatus(`Mission brief imported from "${file.name}". ${extractedSkills.length} skill(s) detected.`);
      navigateToSection('mission-match');
    } catch (error) {
      setSearchStatus(error instanceof Error ? error.message : 'Unable to import mission brief file.');
    } finally {
      setIsImportingMissionBrief(false);
      if (missionBriefInputRef.current) {
        missionBriefInputRef.current.value = '';
      }
    }
  };

  const handleMissionBriefInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    importMissionBriefFile(file).catch((error) => {
      setSearchStatus(error instanceof Error ? error.message : 'Unable to import mission brief file.');
    });
  };

  const handleMissionBriefDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    importMissionBriefFile(file).catch((error) => {
      setSearchStatus(error instanceof Error ? error.message : 'Unable to import mission brief file.');
    });
  };

  const openCvPreview = (profile: CandidateProfile): void => {
    if (!profile.cvUrl) return;

    setCvPreview({
      title: profile.title || `Candidate ${profile.id}`,
      url: profile.cvUrl
    });
  };

  const extractSkillsFromBrief = (): void => {
    const lower = missionBrief.toLowerCase();
    const extracted = suggestedSkills.filter((skill) => lower.includes(skill.toLowerCase()));
    const nextSkills = Array.from(new Set([...selectedSkills, ...extracted]));
    setSelectedSkills(nextSkills);
    logSearch(nextSkills).catch((error) => {
      setSearchStatus(error instanceof Error ? error.message : 'Search log failed.');
    });
    navigateToSection('mission-match');
  };

  const logSearch = async (skillsForSearch = searchSkills): Promise<void> => {
    setIsSavingMission(true);
    setSearchStatus(editingMissionId ? 'Updating mission and logging search...' : 'Logging search...');
    const monthKey = getMonthKey(new Date());

    try {
      const usedSearches = await serviceRef.current.countMonthlySearches(
        webPartProps.auditListTitle,
        webPartProps.partnerName,
        userEmail,
        monthKey
      );
      const results = filterProfiles(availableProfiles, skillsForSearch, seniority, availability);
      const remaining = Math.max(0, partnerMonthlyQuota - usedSearches - 1);
      const missionTitle = missionBrief.trim().split(/\n|[.!?]/)[0]?.trim() || `Skills search: ${skillsForSearch.slice(0, 3).join(', ')}`;
      const missionPayload = {
        title: missionTitle,
        partnerName: webPartProps.partnerName,
        userEmail,
        missionBrief,
        skills: skillsForSearch,
        seniority,
        availability,
        resultsCount: results.length
      };

      await serviceRef.current.logSearch(webPartProps.auditListTitle, {
        title: `${webPartProps.partnerName} search ${new Date().toISOString()}`,
        partnerName: webPartProps.partnerName,
        userEmail,
        query: missionBrief,
        skills: skillsForSearch,
        resultsCount: results.length,
        quotaMaximum: partnerMonthlyQuota,
        searchesRemaining: remaining,
        monthKey
      });

      if (editingMissionId) {
        await serviceRef.current.updatePartnerMission(webPartProps.missionListTitle, editingMissionId, missionPayload);
      } else {
        await serviceRef.current.savePartnerMission(webPartProps.missionListTitle, missionPayload);
      }

      setSearchesRemaining(remaining);
      setEditingMissionId(undefined);
      setActiveMissionMenuId(undefined);
      setSearchStatus(`${editingMissionId ? 'Mission updated' : 'Search logged'}. ${results.length} CV(s) found. ${remaining} search(es) remaining this month.`);
      await loadPartnerMissions();
    } finally {
      setIsSavingMission(false);
    }
  };

  const reuseMission = (mission: IPartnerMissionItem): void => {
    setMissionBrief(mission.MissionBrief || '');
    setSelectedSkills(splitSkills(mission.MissionSkills || ''));
    setSeniority(mission.Seniority || '');
    setAvailability(mission.Availability || '');
    setEditingMissionId(undefined);
    setActiveMissionMenuId(undefined);
    setSearchStatus(`Loaded mission "${mission.Title || `#${mission.Id}`}". You can refine and search again.`);
  };

  const editMission = (mission: IPartnerMissionItem): void => {
    setMissionBrief(mission.MissionBrief || '');
    setSelectedSkills(splitSkills(mission.MissionSkills || ''));
    setSeniority(mission.Seniority || '');
    setAvailability(mission.Availability || '');
    setEditingMissionId(mission.Id);
    setActiveMissionMenuId(undefined);
    setSearchStatus(`Editing mission "${mission.Title || `#${mission.Id}`}". Launch search to save changes.`);
  };

  const deleteMission = async (mission: IPartnerMissionItem): Promise<void> => {
    const label = mission.Title || `Mission #${mission.Id}`;
    if (!window.confirm(`Delete "${label}" from partner mission history?`)) return;

    setActiveMissionMenuId(undefined);
    setSearchStatus(`Deleting mission "${label}"...`);

    await serviceRef.current.deletePartnerMission(webPartProps.missionListTitle, mission.Id);
    if (editingMissionId === mission.Id) {
      setEditingMissionId(undefined);
    }
    setSearchStatus(`Mission "${label}" deleted.`);
    await loadPartnerMissions();
  };

  const importCvDocuments = async (): Promise<void> => {
    setIsImportingDocuments(true);
    setAdminStatus('Scanning SharePoint CV documents...');
    setAdminError('');

    try {
      const [documents, existingCvs] = await Promise.all([
        serviceRef.current.getCvDocuments(webPartProps.cvDocumentLibraryTitle, webPartProps.cvRowLimit),
        serviceRef.current.getPartnerCvKeys(webPartProps.cvListTitle, webPartProps.cvRowLimit)
      ]);
      const existingCandidateIds = new Set(existingCvs.map((item) => item.CandidateId).filter(Boolean));
      const existingUrls = new Set(existingCvs.map((item) => item.CvUrl?.Url).filter(Boolean));
      const candidates = documents
        .map((document) => mapDocumentToPartnerCv(siteUrl, document))
        .filter((candidate) => !existingCandidateIds.has(candidate.candidateId) && !existingUrls.has(candidate.cvUrl));

      for (const candidate of candidates) {
        await serviceRef.current.createPartnerCv(webPartProps.cvListTitle, candidate);
      }

      setAdminStatus(`Import complete. ${documents.length} document(s) scanned, ${candidates.length} new PartnerCV item(s) created.`);
      const items = await serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit);
      setAvailableProfiles(items.map(mapSharePointCv));
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Unable to import CV documents.');
    } finally {
      setIsImportingDocuments(false);
    }
  };

  const navigateToSection = (sectionId: SectionId): void => {
    setActiveSection(sectionId);
  };

  const layoutMode: LayoutMode = containerWidth < 680 ? 'mobile' : containerWidth < 1060 ? 'tablet' : 'desktop';
  const sectionPositions: Record<SectionId, number> = {
    overview: overviewPosition,
    'mission-match': missionMatchPosition,
    'cv-library': cvLibraryPosition,
    plans: plansPosition,
    compliance: compliancePosition,
    administration: 99
  };
  const visibleNavItems = navItems.filter((item) => item.id !== 'administration' || isAdmin);
  const orderedNavItems = [...visibleNavItems].sort((left, right) =>
    (sectionPositions[left.id] - sectionPositions[right.id]) || (left.defaultOrder - right.defaultOrder)
  );
  const styles = buildStyles({
    portalTemplate,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    layoutMode
  });

  return (
    <div ref={rootRef} style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brandBlock}>
          <span style={styles.logoMark}><InlineIcon name="brandMark" size={34} /></span>
          <div>
            <div style={styles.brand}>{activeSection === 'overview' ? 'SaaS Partner Cockpit' : brandLabel}</div>
            <p style={styles.brandCopy}>Partner access for anonymized CV discovery and mission matching.</p>
          </div>
        </div>
        <nav style={styles.nav}>
          {orderedNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              style={activeSection === item.id ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
              onClick={() => navigateToSection(item.id)}
            >
              <span style={styles.navGlyph}><InlineIcon name={getSectionIcon(item.id)} size={18} /></span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={styles.headerActions}>
          <span style={styles.headerIcon}><InlineIcon name="bell" size={20} /></span>
          <span style={styles.avatarBadge}>P</span>
          <span style={styles.chevron}><InlineIcon name="chevronDown" size={18} /></span>
        </div>
        <div style={activeSection === 'overview' ? styles.sidePanelHidden : styles.sidePanel}>
          <strong>Partner status</strong>
          <span>{webPartProps.partnerName}</span>
          <span>{searchesRemaining} / {partnerMonthlyQuota} searches remaining this month.</span>
        </div>
      </aside>

      <main style={styles.content}>
        {activeSection === 'overview' ? (
        <section id="overview" style={{ ...styles.overview, order: sectionPositions.overview }}>
          <div style={styles.overviewBackdrop}>
            <div style={styles.overviewHeroCopy}>
              <span style={styles.overviewKicker}>Partner access for anonymized<br />CV discovery and mission matching</span>
              <h1 style={styles.overviewHeadline}>Smarter matches.<br />Stronger missions.</h1>
              <p style={styles.overviewLead}>
                Discover anonymized talent, find the perfect fit,<br />and reveal identity only when you're ready.
              </p>
            </div>
            <div style={styles.overviewStatusCard}>
              <div style={styles.statusHeader}>
                <span style={styles.statusIcon}><InlineIcon name="user" size={28} /></span>
                <div style={styles.statusCopy}>
                  <strong>Partner status</strong>
                  <span>{webPartProps.partnerName}</span>
                </div>
              </div>
              <div style={styles.quotaRow}>
                <span style={styles.quotaRing} />
                <div style={styles.quotaCopy}>
                  <strong>{searchesRemaining} / {partnerMonthlyQuota}</strong>
                  <span>searches remaining this month.</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.overviewCardTop}>
              <div style={styles.overviewCardCopy}>
                <span style={styles.eyebrow}>SaaS partner cockpit</span>
                <h2 style={styles.overviewTitle}>{portalTitle}</h2>
                <p style={styles.overviewBody}>
                  Search anonymized candidate profiles by skills or mission brief,
                  shortlist the best matches, and request controlled identity reveal
                  only when the fit is validated.
                </p>
                <div style={styles.heroActions}>
                  <button type="button" style={styles.primaryButton} onClick={extractSkillsFromBrief}>
                    <span style={styles.buttonIcon}><InlineIcon name="search" size={18} /></span>
                    Analyze mission
                    <span style={styles.buttonArrow}><InlineIcon name="arrowRight" size={18} /></span>
                  </button>
                  <button type="button" style={styles.secondaryButton} onClick={() => navigateToSection('plans')}>
                    <span style={styles.buttonIcon}><InlineIcon name="lock" size={18} /></span>
                    Request partner access
                  </button>
                </div>
              </div>
              <div style={styles.matchIllustration}>
                <span style={styles.radarCircleOuter} />
                <span style={styles.radarCircleInner} />
                <span style={styles.radarCrossHorizontal} />
                <span style={styles.radarCrossVertical} />
                <span style={styles.matchCheck}><InlineIcon name="check" size={28} /></span>
                <span style={{ ...styles.profileChip, ...styles.profileChipLeft }}>
                  <span style={styles.chipAvatar}><InlineIcon name="user" size={20} /></span>
                  <span style={styles.chipLines}>
                    <span style={styles.chipLineLong} />
                    <span style={styles.chipLineShort} />
                  </span>
                </span>
                <span style={{ ...styles.profileChip, ...styles.profileChipRight }}>
                  <span style={styles.chipAvatar}><InlineIcon name="user" size={20} /></span>
                  <span style={styles.chipLines}>
                    <span style={styles.chipLineLong} />
                    <span style={styles.chipLineShort} />
                  </span>
                </span>
              </div>
            </div>

            <div style={styles.overviewDivider} />
            <div style={styles.overviewMetrics}>
              <Metric value={`${availableProfiles.length}`} label="Missions analyzed" detail="This month" icon="user" styles={styles} />
              <Metric value={isLoadingCvs ? '...' : `${rankedProfiles.length}`} label="Matches found" detail="This month" icon="document" styles={styles} />
              <Metric value="94%" label="Match success rate" detail="Validated fit" icon="trend" styles={styles} />
            </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'mission-match' ? (
        <section id="mission-match" style={{ ...styles.missionFrame, order: sectionPositions['mission-match'] }}>
          <div style={styles.missionHero}>
            <div style={styles.missionHeroCopy}>
              <span style={styles.missionKicker}><InlineIcon name="sparkle" /> Mission intelligence</span>
              <h2 style={styles.missionTitle}>Mission Match</h2>
              <p style={styles.missionLead}>Capture a mission brief, extract explicit skills, and turn every search into a reusable partner mission record.</p>
            </div>
            <div style={styles.missionHeroActions}>
              <button type="button" style={styles.missionGhostButton} onClick={startNewMission}>
                <InlineIcon name="plus" />
                New mission
              </button>
              <button
                type="button"
                style={isImportingMissionBrief ? { ...styles.missionGhostButton, ...styles.disabledButton } : styles.missionGhostButton}
                onClick={() => missionBriefInputRef.current?.click()}
                disabled={isImportingMissionBrief}
              >
                <InlineIcon name="cloudUpload" />
                {isImportingMissionBrief ? 'Importing...' : 'Import brief'}
              </button>
            </div>
            <div style={styles.missionStats}>
              <MissionStat icon="bookmark" value={`${partnerMissions.length}`} label="Saved missions" progress={70} styles={styles} />
              <MissionStat icon="user" value={`${selectedSkills.length}`} label="Active skills" progress={selectedSkills.length > 0 ? 28 : 12} styles={styles} />
              <MissionStat icon="search" value={`${searchesRemaining}`} label="Searches left" progress={58} styles={styles} />
            </div>
          </div>

          <div style={styles.missionWorkbench}>
            <div style={styles.missionComposer}>
              <div style={styles.missionPanelHeader}>
                <span style={styles.missionPanelIcon}><InlineIcon name="document" /></span>
                <div>
                  <h3 style={styles.missionPanelTitle}>Mission Composer</h3>
                  <span style={styles.missionPanelKicker}>Mission / offer brief</span>
                </div>
                {editingMissionId ? <span style={styles.editingBadge}>Editing mission #{editingMissionId}</span> : null}
                <button type="button" style={styles.aiPill} onClick={extractSkillsFromBrief}><InlineIcon name="sparkle" /> AI-powered extraction</button>
              </div>

              <div style={styles.missionTextareaWrap}>
                <textarea
                  style={styles.missionTextarea}
                  value={missionBrief}
                  onChange={(event) => setMissionBrief(event.currentTarget.value)}
                  placeholder="Paste mission brief or job description..."
                />
                <span style={styles.textareaHint}><InlineIcon name="lightbulb" /></span>
                <span style={styles.grammarBadge}>G</span>
              </div>

              <input
                ref={missionBriefInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                style={styles.hiddenInput}
                onChange={handleMissionBriefInputChange}
              />

              <div
                style={isImportingMissionBrief ? { ...styles.dropZone, ...styles.dropZoneBusy } : styles.dropZone}
                role="button"
                tabIndex={0}
                onClick={() => missionBriefInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleMissionBriefDrop}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    missionBriefInputRef.current?.click();
                  }
                }}
              >
                <span style={styles.dropIcon}><InlineIcon name="cloudUpload" /></span>
                <div>
                  <strong>{isImportingMissionBrief ? 'Reading mission brief...' : 'Drag & drop a file here, or click to upload'}</strong>
                  <span>PDF, DOCX, or TXT - Max 10MB</span>
                </div>
              </div>

              <div>
                <FieldLabel label="Sample extracted skills" />
                <div style={styles.extractedSkills}>
                  {(selectedSkills.length > 0 ? selectedSkills : ['Java', 'Kafka', 'French', 'Banking', '6+ years']).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      style={styles.extractedSkill}
                      onClick={() => toggleSkill(skill)}
                    >
                      <InlineIcon name={getSkillIcon(skill)} />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.missionActionRow}>
                <button type="button" style={styles.extractButton} onClick={extractSkillsFromBrief}>
                  <InlineIcon name="sparkle" />
                  Extract skills
                </button>
                <button
                  type="button"
                  style={isSavingMission ? { ...styles.launchButton, ...styles.disabledButton } : styles.launchButton}
                  onClick={() => logSearch()}
                  disabled={isSavingMission}
                >
                  <InlineIcon name="search" />
                  {isSavingMission ? 'Saving...' : editingMissionId ? 'Save mission changes' : 'Launch search'}
                </button>
              </div>
              <div style={styles.missionFilters}>
                <input
                  style={styles.missionSkillInput}
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill manually..."
                />
                <button type="button" style={styles.compactButton} onClick={addSkill}>Add</button>
                <select style={styles.missionSelect} value={seniority} onChange={(event) => setSeniority(event.currentTarget.value)}>
                  <option value="">Any seniority</option>
                  <option>Senior</option>
                  <option>Lead</option>
                  <option>Architect</option>
                </select>
                <select style={styles.missionSelect} value={availability} onChange={(event) => setAvailability(event.currentTarget.value)}>
                  <option value="">Any availability</option>
                  <option>Immediate</option>
                  <option>Under 2 weeks</option>
                  <option>Under 1 month</option>
                </select>
              </div>
              <div style={styles.criteriaList} aria-label="Active search criteria">
                {searchCriteria.map((criteria) => (
                  <span key={criteria} style={styles.criteriaPill}>{criteria}</span>
                ))}
              </div>
              {searchStatus ? <p style={styles.statusText}>{searchStatus}</p> : null}
              {dataError ? <p style={styles.errorText}>{dataError}</p> : null}
            </div>

            <div style={styles.missionHistoryPanel}>
              <div style={styles.missionPanelHeader}>
                <span style={styles.missionPanelIcon}><InlineIcon name="history" /></span>
                <div>
                  <h3 style={styles.missionPanelTitle}>Partner Mission History</h3>
                  <span style={styles.missionPanelKicker}>Recent searches & reused criteria</span>
                </div>
                <button
                  type="button"
                  style={styles.viewAllButton}
                  onClick={() => setShowAllMissions((current) => !current)}
                  disabled={partnerMissions.length <= 3}
                >
                  {showAllMissions ? 'Show latest' : `View all (${partnerMissions.length})`}
                </button>
              </div>
              {isLoadingMissions ? <p style={styles.muted}>Loading partner missions...</p> : null}
              {missionError ? <p style={styles.errorText}>{missionError}</p> : null}
              {!isLoadingMissions && !missionError && partnerMissions.length === 0 ? (
                <p style={styles.muted}>No mission saved yet for {webPartProps.partnerName}.</p>
              ) : null}
              <div style={styles.missionHistoryList}>
                {visibleMissions.map((mission, index) => (
                  <article key={mission.Id} style={index === 0 ? { ...styles.historyCard, ...styles.historyCardFeatured } : styles.historyCard}>
                    <span style={styles.historyIcon}><InlineIcon name={index === 0 ? 'search' : index === 1 ? 'database' : 'briefcase'} /></span>
                    <div style={styles.historyContent}>
                      <div style={styles.historyTop}>
                        <div>
                          <h4 style={styles.historyTitle}>{mission.Title || (index === 0 ? 'Skills search' : `Mission #${mission.Id}`)}</h4>
                          <p style={styles.historyMeta}>{formatMissionDate(mission.Created)} - {mission.UserEmail || 'Partner user'}</p>
                        </div>
                        <div style={styles.historyMenuWrap}>
                          <button
                            type="button"
                            style={styles.historyMenuButton}
                            onClick={() => setActiveMissionMenuId(activeMissionMenuId === mission.Id ? undefined : mission.Id)}
                            aria-label={`Open actions for ${mission.Title || `mission ${mission.Id}`}`}
                          >
                            <InlineIcon name="moreVertical" />
                          </button>
                          {activeMissionMenuId === mission.Id ? (
                            <div style={styles.historyMenuPanel}>
                              <button type="button" style={styles.historyMenuAction} onClick={() => editMission(mission)}>Edit mission</button>
                              <button type="button" style={styles.historyMenuAction} onClick={() => reuseMission(mission)}>Reuse criteria</button>
                              <button
                                type="button"
                                style={{ ...styles.historyMenuAction, ...styles.historyMenuDanger }}
                                onClick={() => {
                                  deleteMission(mission).catch((error) => {
                                    setSearchStatus(error instanceof Error ? error.message : 'Unable to delete mission.');
                                  });
                                }}
                              >
                                Delete mission
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {index === 0 ? <p style={styles.profileSummary}>{mission.MissionBrief || 'No mission brief captured.'}</p> : null}
                      <div style={styles.historyBottom}>
                        <p style={styles.historyCriteria}>
                          <strong>Criteria:</strong> {mission.Seniority || 'Any seniority'} - {mission.Availability || 'Any availability'}
                          {mission.MissionSkills ? ` - ${mission.MissionSkills}` : ''}
                        </p>
                        <span style={styles.resultBadge}>{mission.ResultsCount || 0} CVs</span>
                      </div>
                      {index === 0 ? (
                        <button type="button" style={styles.reuseButton} onClick={() => reuseMission(mission)}>
                          <InlineIcon name="refresh" />
                          Reuse criteria
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'cv-library' ? (
        <section id="cv-library" style={{ ...styles.pageFrame, order: sectionPositions['cv-library'] }}>
          <div style={styles.pageHero}>
            <div>
              <span style={styles.pageKicker}>Curated anonymized talent</span>
              <h2 style={styles.pageTitle}>CV Library</h2>
              <p style={styles.pageLead}>
                Results are loaded from "{webPartProps.cvListTitle}" and each search is logged in "{webPartProps.auditListTitle}".
              </p>
            </div>
            <div style={styles.pageStats}>
              <PageStat value={`${availableProfiles.length}`} label="available CVs" styles={styles} />
              <PageStat value={isLoadingCvs ? '...' : `${rankedProfiles.length}`} label="matched profiles" styles={styles} />
              <PageStat value="94%" label="curated relevance" styles={styles} />
            </div>
          </div>
          <div style={styles.pageBody}>
          <div style={styles.resultList}>
            {isLoadingCvs ? <p style={styles.muted}>Loading SharePoint CVs...</p> : null}
            {!isLoadingCvs && rankedProfiles.length === 0 ? <p style={styles.muted}>No available CV matched the current search.</p> : null}
            {!isLoadingCvs && rankedProfiles.map((profile) => (
              <article key={profile.id} style={styles.cvCard}>
                <div style={styles.cvTop}>
                  <div>
                    <span style={styles.candidateId}>Candidate {profile.id}</span>
                    <h3 style={styles.cardTitle}>{profile.title}</h3>
                    <p style={styles.muted}>{profile.meta}</p>
                  </div>
                  <div style={styles.scoreBox}>
                    <strong>{profile.score}%</strong>
                    <span>fit</span>
                  </div>
                </div>
                <p style={styles.profileSummary}>{profile.summary}</p>
                <div style={styles.skillPills}>
                  {profile.skills.map((skill) => <span key={skill} style={styles.skillPill}>{skill}</span>)}
                </div>
                <div style={styles.cardActions}>
                  <button type="button" style={styles.primaryButton}>Request identity reveal</button>
                  {profile.cvUrl ? (
                    <button type="button" style={styles.secondaryButton} onClick={() => openCvPreview(profile)}>
                      Open CV
                    </button>
                  ) : (
                    <button type="button" style={styles.secondaryButton}>Save shortlist</button>
                  )}
                </div>
              </article>
            ))}
          </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'plans' ? (
        <section id="plans" style={{ ...styles.pageFrame, order: sectionPositions.plans }}>
          <div style={styles.pageHero}>
            <div>
              <span style={styles.pageKicker}>Partner access tiers</span>
              <h2 style={styles.pageTitle}>Plans</h2>
              <p style={styles.pageLead}>Package search quotas, controlled identity reveal, and governed audit retention into clear partner-ready tiers.</p>
            </div>
            <div style={styles.pageStats}>
              <PageStat value="3" label="subscription tiers" styles={styles} />
              <PageStat value={`${partnerMonthlyQuota}`} label="default quota" styles={styles} />
              <PageStat value="SSO" label="enterprise ready" styles={styles} />
            </div>
          </div>
          <div style={styles.pageBody}>
          <div style={styles.planList}>
            {plans.map((plan) => (
              <article key={plan.name} style={plan.featured ? { ...styles.plan, ...styles.featuredPlan } : styles.plan}>
                <h3 style={styles.planTitle}>{plan.name}</h3>
                <p style={styles.planCopy}>{plan.detail}</p>
                <strong style={styles.price}>{plan.price}</strong>
                <ul style={styles.featureList}>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </article>
            ))}
          </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'compliance' ? (
        <section id="compliance" style={{ ...styles.pageFrame, order: sectionPositions.compliance }}>
          <div style={styles.pageHero}>
            <div>
              <span style={styles.pageKicker}>Trust by design</span>
              <h2 style={styles.pageTitle}>Compliance</h2>
              <p style={styles.pageLead}>Keep partners productive while preserving anonymization, auditability, and controlled reveal governance.</p>
            </div>
            <div style={styles.pageStats}>
              <PageStat value="GDPR" label="privacy first" styles={styles} />
              <PageStat value="Audit" label="traceable actions" styles={styles} />
              <PageStat value="Reveal" label="approval gated" styles={styles} />
            </div>
          </div>
          <div style={styles.pageBody}>
            <div style={styles.complianceGrid}>
              <WorkflowStep number="G" title="GDPR-first" text="Names, contacts, and raw CVs stay protected by default." styles={styles} />
              <WorkflowStep number="A" title="Audit trail" text="Searches, shortlists, and reveal requests can be logged." styles={styles} />
              <WorkflowStep number="R" title="Reveal control" text="Identity release remains an explicit, reviewable workflow event." styles={styles} />
            </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'administration' && isAdmin ? (
        <section id="administration" style={{ ...styles.pageFrame, order: sectionPositions.administration }}>
          <div style={styles.pageHero}>
            <div>
              <span style={styles.pageKicker}>Governed operations</span>
              <h2 style={styles.pageTitle}>Administration</h2>
              <p style={styles.pageLead}>
                Admin tools are visible only for active users declared in "{webPartProps.adminListTitle}".
              </p>
            </div>
            <div style={styles.pageStats}>
              <PageStat value={isCheckingAdmin ? '...' : isAdmin ? 'OK' : 'No'} label="admin access" styles={styles} />
              <PageStat value={webPartProps.cvListTitle} label="target list" styles={styles} />
              <PageStat value={webPartProps.cvDocumentLibraryTitle} label="source library" styles={styles} />
            </div>
          </div>
          <div style={styles.pageBody}>
          <div style={styles.adminGrid}>
            <div style={styles.panel}>
              <FieldLabel label="SharePoint CV import" />
              <p style={styles.muted}>
                Scan PDF/DOCX files from "{webPartProps.cvDocumentLibraryTitle}" and create missing anonymized entries in "{webPartProps.cvListTitle}".
              </p>
              <div style={styles.workflow}>
                <WorkflowStep number="1" title="Scan documents" text="Read PDF/DOCX metadata from the configured SharePoint library." styles={styles} />
                <WorkflowStep number="2" title="Infer metadata" text="Build profile title, candidate alias, seniority, availability and skills from file metadata." styles={styles} />
                <WorkflowStep number="3" title="Fill PartnerCVs" text="Create only missing CV records and skip existing candidate/document URLs." styles={styles} />
              </div>
              <button type="button" style={styles.primaryButton} onClick={importCvDocuments} disabled={isImportingDocuments}>
                {isImportingDocuments ? 'Importing...' : 'Parse SharePoint documents into PartnerCVs'}
              </button>
              {adminStatus ? <p style={styles.statusText}>{adminStatus}</p> : null}
              {adminError ? <p style={styles.errorText}>{adminError}</p> : null}
            </div>
            <div style={styles.panel}>
              <FieldLabel label="Current configuration" />
              <div style={styles.configList}>
                <span>Admin list: <strong>{webPartProps.adminListTitle}</strong></span>
                <span>Document library: <strong>{webPartProps.cvDocumentLibraryTitle}</strong></span>
                <span>Target CV list: <strong>{webPartProps.cvListTitle}</strong></span>
                <span>Current user: <strong>{userEmail}</strong></span>
                <span>Admin check: <strong>{isCheckingAdmin ? 'checking...' : isAdmin ? 'allowed' : 'denied'}</strong></span>
              </div>
            </div>
          </div>
          </div>
        </section>
        ) : null}
      </main>

      {cvPreview ? (
        <div
          style={styles.previewOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`CV preview for ${cvPreview.title}`}
          onClick={() => setCvPreview(undefined)}
        >
          <div style={styles.previewDialog} onClick={(event) => event.stopPropagation()}>
            <div style={styles.previewHeader}>
              <div>
                <span style={styles.pageKicker}>Secure preview</span>
                <h3 style={styles.previewTitle}>{cvPreview.title}</h3>
              </div>
              <div style={styles.previewActions}>
                <a href={cvPreview.url} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
                  Open in new tab
                </a>
                <button type="button" style={styles.previewCloseButton} onClick={() => setCvPreview(undefined)} aria-label="Close CV preview">
                  Close
                </button>
              </div>
            </div>
            <iframe
              src={cvPreview.url}
              title={`CV preview - ${cvPreview.title}`}
              style={styles.previewFrame}
            />
            <p style={styles.previewHelp}>
              If the preview remains blank, use "Open in new tab". Some SharePoint or Office document links can block embedded rendering.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InlineIcon({ name, size = 20 }: { name: IconName; size?: number }): JSX.Element {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false
  };

  switch (name) {
    case 'bank':
      return <svg {...commonProps}><path d="M3 10h18" /><path d="M5 10l7-5 7 5" /><path d="M6 10v8" /><path d="M10 10v8" /><path d="M14 10v8" /><path d="M18 10v8" /><path d="M4 18h16" /></svg>;
    case 'arrowRight':
      return <svg {...commonProps}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
    case 'bell':
      return <svg {...commonProps}><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21a2 2 0 0 0 4 0" /><path d="M19 4l1-1" /></svg>;
    case 'briefcase':
      return <svg {...commonProps}><path d="M10 6h4a2 2 0 0 1 2 2v2H8V8a2 2 0 0 1 2-2Z" /><path d="M4 10h16v9H4z" /><path d="M4 14h16" /><path d="M10 14v2h4v-2" /></svg>;
    case 'bookmark':
      return <svg {...commonProps}><path d="M7 4h10v16l-5-3-5 3Z" /></svg>;
    case 'brandMark':
      return <svg {...commonProps} viewBox="0 0 36 44" strokeWidth={0} fill="currentColor"><path d="M20 1 34 9 17 27 9 22 23 8 18 5 5 18 1 15Z" /><path d="M16 17 30 25 13 43 5 38 19 24 14 21Z" /><path d="M23 30 35 23 35 30 24 37Z" /></svg>;
    case 'box':
      return <svg {...commonProps}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="M12 12 4 7.5" /><path d="m12 12 8-4.5" /><path d="M12 12v9" /></svg>;
    case 'card':
      return <svg {...commonProps}><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M4 10h16" /><path d="M7 15h4" /></svg>;
    case 'check':
      return <svg {...commonProps}><path d="m6 12 4 4 8-8" /></svg>;
    case 'chevronDown':
      return <svg {...commonProps}><path d="m7 10 5 5 5-5" /></svg>;
    case 'clock':
      return <svg {...commonProps}><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>;
    case 'cloudUpload':
      return <svg {...commonProps}><path d="M7 18H6a4 4 0 0 1-.5-8A6 6 0 0 1 17 8.5 4.5 4.5 0 0 1 18 18h-1" /><path d="M12 18V10" /><path d="M9 13l3-3 3 3" /></svg>;
    case 'code':
      return <svg {...commonProps}><path d="M8 9 4 12l4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></svg>;
    case 'database':
      return <svg {...commonProps}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>;
    case 'document':
      return <svg {...commonProps}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h5" /></svg>;
    case 'documentImage':
      return <svg {...commonProps}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5" /><path d="M9 17l2.2-2.2 1.8 1.8 2.2-3 2.8 3.4" /><path d="M9 11h2" /></svg>;
    case 'gear':
      return <svg {...commonProps}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .1 1.7 1.7 0 0 0-.8 1.7v.2H10v-.2a1.7 1.7 0 0 0-.8-1.7 1.7 1.7 0 0 0-2-.1l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.4-1.1H3.8v-3.8H4a1.7 1.7 0 0 0 1.4-1.1 1.7 1.7 0 0 0-.3-1.9L5 7l2-3.4.2.1a1.7 1.7 0 0 0 2-.1A1.7 1.7 0 0 0 10 1.9v-.2h4v.2a1.7 1.7 0 0 0 .8 1.7 1.7 1.7 0 0 0 2 .1l.2-.1L19 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.4 1.1h.2v3.8H20a1.7 1.7 0 0 0-1.4 1.1Z" /></svg>;
    case 'globe':
      return <svg {...commonProps}><circle cx="12" cy="12" r="8" /><path d="M4 12h16" /><path d="M12 4a12 12 0 0 1 0 16" /><path d="M12 4a12 12 0 0 0 0 16" /></svg>;
    case 'history':
      return <svg {...commonProps}><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5" /><path d="M4 4v4.5h4.5" /><path d="M12 8v5l3 2" /></svg>;
    case 'lightbulb':
      return <svg {...commonProps}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14a6 6 0 1 1 8 0c-.9.7-1.3 1.5-1.4 2.5H9.4C9.3 15.5 8.9 14.7 8 14Z" /></svg>;
    case 'lock':
      return <svg {...commonProps}><rect x="6" y="10" width="12" height="10" rx="2" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /><path d="M12 14v2" /></svg>;
    case 'moreVertical':
      return <svg {...commonProps}><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></svg>;
    case 'plus':
      return <svg {...commonProps}><path d="M12 5v14" /><path d="M5 12h14" /></svg>;
    case 'refresh':
      return <svg {...commonProps}><path d="M20 12a8 8 0 0 1-13.7 5.7" /><path d="M4 12A8 8 0 0 1 17.7 6.3" /><path d="M17 3v4h4" /><path d="M7 21v-4H3" /></svg>;
    case 'shield':
      return <svg {...commonProps}><path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case 'search':
      return <svg {...commonProps}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
    case 'share':
      return <svg {...commonProps}><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="m8 11 8-4" /><path d="m8 13 8 4" /></svg>;
    case 'signal':
      return <svg {...commonProps}><path d="M4 18h3v-5H4z" /><path d="M10.5 18h3V9h-3z" /><path d="M17 18h3V5h-3z" /></svg>;
    case 'sparkle':
      return <svg {...commonProps}><path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" /></svg>;
    case 'trend':
      return <svg {...commonProps}><path d="M4 17 10 11l4 4 6-8" /><path d="M15 7h5v5" /></svg>;
    case 'user':
      return <svg {...commonProps}><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    default:
      return <svg {...commonProps}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function FieldLabel({ label }: { label: string }): JSX.Element {
  return <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>;
}

function PageStat({ value, label, styles }: { value: string; label: string; styles: Record<string, React.CSSProperties> }): JSX.Element {
  return (
    <div style={styles.pageStat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MissionStat({
  icon,
  value,
  label,
  progress,
  styles
}: {
  icon: IconName;
  value: string;
  label: string;
  progress: number;
  styles: Record<string, React.CSSProperties>;
}): JSX.Element {
  return (
    <div style={styles.missionStat}>
      <span style={styles.missionStatIcon}><InlineIcon name={icon} /></span>
      <strong>{value}</strong>
      <span>{label}</span>
      <i style={{ ...styles.missionStatProgress, width: `${progress}%` }} />
    </div>
  );
}

function Metric({
  value,
  label,
  detail,
  icon,
  styles
}: {
  value: string;
  label: string;
  detail?: string;
  icon?: IconName;
  styles: Record<string, React.CSSProperties>;
}): JSX.Element {
  return (
    <div style={styles.metric}>
      {icon ? <span style={styles.metricIcon}><InlineIcon name={icon} size={32} /></span> : null}
      <span style={styles.metricCopy}>
        <strong>{value}</strong>
        <span>{label}</span>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}

function WorkflowStep({ number, title, text, styles }: { number: string; title: string; text: string; styles: Record<string, React.CSSProperties> }): JSX.Element {
  return (
    <div style={styles.workflowStep}>
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

interface StyleOptions {
  portalTemplate: PartnerPortalTemplate;
  primaryColor: string;
  secondaryColor: string;
  accentTextColor: string;
  surfaceColor: string;
  webPartMaxWidth: number;
  sidebarWidth: number;
  minHeight: number;
  contentPadding: number;
  sectionGap: number;
  cardPadding: number;
  borderRadius: number;
  metricMinWidth: number;
  metricMinHeight: number;
  titleFontSize: number;
  bodyFontSize: number;
  layoutMode: LayoutMode;
}

function buildTemplateTokens(
  portalTemplate: PartnerPortalTemplate,
  primaryColor: string,
  secondaryColor: string,
  accentTextColor: string,
  surfaceColor: string
): TemplateTokens {
  const defaultHeroColumns = (metricMinWidth: number, sectionGap: number): string =>
    `minmax(0,1.3fr) minmax(${metricMinWidth * 2 + sectionGap}px,0.9fr)`;

  switch (portalTemplate) {
    case 'executive-partner':
      return {
        navigation: 'top',
        shellBackground: '#f7f9fb',
        sidebarBackground: '#ffffff',
        sidebarTextColor: accentTextColor,
        sidebarMutedColor: '#607078',
        sidebarRadius: 0,
        sidebarShadow: '0 10px 28px rgba(15,23,42,0.06)',
        navTextColor: accentTextColor,
        navActiveBackground: 'rgba(19,109,112,0.1)',
        navActiveTextColor: secondaryColor,
        sidePanelBackground: '#eef6f7',
        cardBackground: '#ffffff',
        panelBackground: '#f8fbfc',
        cardBorder: '1px solid rgba(16,36,46,0.1)',
        cardShadow: '0 18px 42px rgba(15,23,42,0.08)',
        mutedTextColor: '#5a6f77',
        fontFamily: 'Georgia, Aptos, Segoe UI, sans-serif',
        heroColumns: defaultHeroColumns,
        cardRadius: (borderRadius) => Math.max(6, borderRadius)
      };
    case 'marketplace-talent':
      return {
        navigation: 'side',
        shellBackground: '#f3faf9',
        sidebarBackground: `linear-gradient(160deg, ${secondaryColor}, #0d3439)`,
        sidebarTextColor: '#ffffff',
        sidebarMutedColor: 'rgba(255,255,255,0.76)',
        sidebarRadius: 28,
        sidebarShadow: '0 22px 50px rgba(13,52,57,0.22)',
        navTextColor: '#ffffff',
        navActiveBackground: 'rgba(255,255,255,0.2)',
        navActiveTextColor: '#ffffff',
        sidePanelBackground: 'rgba(255,255,255,0.14)',
        cardBackground: '#ffffff',
        panelBackground: '#f0fbfb',
        cardBorder: '1px solid rgba(39,194,198,0.18)',
        cardShadow: '0 14px 30px rgba(15,23,42,0.07)',
        mutedTextColor: '#55727b',
        fontFamily: 'Aptos, Segoe UI, sans-serif',
        heroColumns: (_metricMinWidth, _sectionGap) => 'minmax(0,0.9fr) minmax(0,1.1fr)',
        cardRadius: (borderRadius) => Math.max(18, borderRadius)
      };
    case 'mission-match-studio':
      return {
        navigation: 'top',
        shellBackground: `radial-gradient(circle at top left, rgba(39,194,198,0.2), transparent 34%), linear-gradient(135deg, #10242e, ${secondaryColor})`,
        sidebarBackground: 'rgba(255,255,255,0.08)',
        sidebarTextColor: '#ffffff',
        sidebarMutedColor: 'rgba(255,255,255,0.72)',
        sidebarRadius: 26,
        sidebarShadow: 'none',
        navTextColor: '#ffffff',
        navActiveBackground: primaryColor,
        navActiveTextColor: '#ffffff',
        sidePanelBackground: 'rgba(255,255,255,0.12)',
        cardBackground: 'rgba(255,255,255,0.96)',
        panelBackground: 'rgba(255,255,255,0.88)',
        cardBorder: '1px solid rgba(255,255,255,0.34)',
        cardShadow: '0 24px 64px rgba(0,0,0,0.22)',
        mutedTextColor: '#5e7278',
        fontFamily: 'Aptos Display, Aptos, Segoe UI, sans-serif',
        heroColumns: (_metricMinWidth, _sectionGap) => 'minmax(0,1fr) minmax(280px,0.72fr)',
        cardRadius: (borderRadius) => Math.max(22, borderRadius)
      };
    case 'cockpit-saas':
    default:
      return {
        navigation: 'top',
        shellBackground: surfaceColor,
        sidebarBackground: '#ffffff',
        sidebarTextColor: accentTextColor,
        sidebarMutedColor: '#5f7680',
        sidebarRadius: 0,
        sidebarShadow: '0 1px 0 rgba(16,36,46,0.08)',
        navTextColor: accentTextColor,
        navActiveBackground: 'rgba(39,194,198,0.12)',
        navActiveTextColor: secondaryColor,
        sidePanelBackground: '#eef9fa',
        cardBackground: '#ffffff',
        panelBackground: '#f5fbfc',
        cardBorder: '1px solid rgba(16,36,46,0.08)',
        cardShadow: '0 16px 34px rgba(15,23,42,0.07)',
        mutedTextColor: '#55727b',
        fontFamily: 'Aptos, Segoe UI, sans-serif',
        heroColumns: defaultHeroColumns,
        cardRadius: (borderRadius) => borderRadius
      };
  }
}

function buildStyles(options: StyleOptions): Record<string, React.CSSProperties> {
  const {
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    portalTemplate,
    layoutMode
  } = options;
  const isDesktop = layoutMode === 'desktop';
  const isMobile = layoutMode === 'mobile';
  const compactPadding = isMobile ? Math.max(12, Math.round(contentPadding * 0.55)) : contentPadding;
  const compactCardPadding = isMobile ? Math.max(12, Math.round(cardPadding * 0.72)) : cardPadding;
  const effectiveTitleSize = isMobile ? Math.max(30, Math.round(titleFontSize * 0.7)) : layoutMode === 'tablet' ? Math.max(34, Math.round(titleFontSize * 0.82)) : titleFontSize;
  const effectiveBodySize = isMobile ? Math.max(14, bodyFontSize - 2) : bodyFontSize;

  const template = buildTemplateTokens(portalTemplate, primaryColor, secondaryColor, accentTextColor, surfaceColor);
  const usesTopNavigation = template.navigation === 'top';
  const isCockpitSaas = portalTemplate === 'cockpit-saas';
  const headerPadding = isMobile ? `${compactPadding}px` : `${Math.max(18, compactPadding - 4)}px ${Math.max(28, compactPadding + 18)}px`;

  return {
    shell: {
      display: 'grid',
      gridTemplateColumns: isDesktop && !usesTopNavigation ? `${sidebarWidth}px minmax(0, 1fr)` : 'minmax(0, 1fr)',
      width: '100%',
      maxWidth: webPartMaxWidth,
      minWidth: 0,
      minHeight: isMobile ? 'auto' : minHeight,
      margin: '0 auto',
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: accentTextColor,
      background: template.shellBackground,
      fontFamily: template.fontFamily,
      fontSize: effectiveBodySize,
      borderRadius: isCockpitSaas ? (isMobile ? 0 : 18) : undefined,
      border: isCockpitSaas ? '1px solid rgba(16,36,46,0.08)' : undefined,
      boxShadow: isCockpitSaas ? '0 18px 64px rgba(15,23,42,0.08)' : undefined
    },
    sidebar: {
      background: template.sidebarBackground,
      color: template.sidebarTextColor,
      padding: isCockpitSaas ? headerPadding : isDesktop ? `${compactPadding + 2}px ${Math.max(16, compactPadding - 8)}px` : `${compactPadding}px`,
      display: 'flex',
      flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
      flexWrap: isCockpitSaas && !isMobile ? 'nowrap' : 'wrap',
      gap: isCockpitSaas ? (isMobile ? 12 : 20) : isMobile ? 14 : sectionGap,
      alignItems: isDesktop && !usesTopNavigation ? 'stretch' : 'center',
      borderRadius: template.sidebarRadius,
      boxShadow: template.sidebarShadow,
      justifyContent: isCockpitSaas ? 'space-between' : undefined
    },
    brandBlock: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? 10 : 14,
      minWidth: 0,
      flex: isCockpitSaas ? '0 0 auto' : undefined
    },
    logoMark: {
      width: isMobile ? 34 : 42,
      height: isMobile ? 34 : 42,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      color: primaryColor,
      fontWeight: 900,
      fontSize: isMobile ? 18 : 22
    },
    brand: {
      fontSize: isCockpitSaas ? (isMobile ? 17 : 18) : isMobile ? 30 : 38,
      fontWeight: 800,
      textTransform: isCockpitSaas ? 'none' : 'lowercase',
      whiteSpace: isCockpitSaas ? 'nowrap' : undefined
    },
    brandCopy: { display: isCockpitSaas ? 'none' : undefined, margin: '8px 0 0', lineHeight: 1.45, color: template.sidebarMutedColor, maxWidth: isDesktop && !usesTopNavigation ? 'none' : 460 },
    nav: {
      display: 'flex',
      flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: isCockpitSaas ? 10 : 8,
      flex: isCockpitSaas ? '1 1 0' : isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 420px',
      justifyContent: isCockpitSaas ? 'center' : undefined,
      alignItems: 'center'
    },
    navItem: {
      padding: isCockpitSaas ? (isMobile ? '10px 12px' : '13px 18px') : isMobile ? '10px 12px' : '13px 14px',
      border: 'none',
      borderRadius: isCockpitSaas ? 11 : borderRadius,
      background: 'transparent',
      color: template.navTextColor,
      cursor: 'pointer',
      font: 'inherit',
      fontWeight: 700,
      textAlign: 'left',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap'
    },
    navItemActive: { background: template.navActiveBackground, color: template.navActiveTextColor },
    navGlyph: {
      width: 22,
      height: 22,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      border: '1px solid currentColor',
      fontSize: 10,
      fontWeight: 900,
      lineHeight: 1
    },
    headerActions: {
      display: isCockpitSaas ? 'inline-flex' : 'none',
      alignItems: 'center',
      gap: 13,
      flex: '0 0 auto',
      color: accentTextColor
    },
    headerIcon: {
      width: 28,
      height: 28,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      border: '1px solid rgba(16,36,46,0.12)',
      color: secondaryColor,
      fontWeight: 900
    },
    avatarBadge: {
      width: 36,
      height: 36,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 800
    },
    chevron: { fontSize: 14, color: '#49646e', fontWeight: 800 },
    sidePanel: { marginTop: isDesktop && !usesTopNavigation ? 'auto' : 0, padding: compactCardPadding, borderRadius, background: template.sidePanelBackground, display: 'grid', gap: 8, flex: isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 280px' },
    sidePanelHidden: { display: 'none' },
    content: { padding: isCockpitSaas ? 0 : compactPadding, display: 'grid', gap: sectionGap, minWidth: 0 },
    overview: {
      position: 'relative',
      display: 'grid',
      minWidth: 0,
      overflow: 'hidden',
      background: '#eef7fb',
      scrollMarginTop: sectionGap
    },
    overviewBackdrop: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(330px,0.78fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 26 : 42,
      alignItems: 'center',
      padding: isMobile ? '44px 24px 86px' : '58px 72px 112px',
      minHeight: isMobile ? 420 : 390,
      background: `radial-gradient(circle at 88% 42%, rgba(72,255,238,0.78), transparent 28%), radial-gradient(circle at 54% 88%, rgba(39,194,198,0.35), transparent 30%), linear-gradient(118deg, #063641 0%, #006d77 48%, ${primaryColor} 100%)`,
      color: '#ffffff',
      overflow: 'hidden'
    },
    overviewHeroCopy: { position: 'relative', zIndex: 1, maxWidth: 650 },
    overviewKicker: {
      display: 'inline-block',
      color: '#5df7f0',
      fontSize: isMobile ? 12 : 15,
      lineHeight: 1.5,
      letterSpacing: 3.2,
      textTransform: 'uppercase',
      fontWeight: 800
    },
    overviewHeadline: {
      margin: isMobile ? '24px 0 18px' : '28px 0 20px',
      fontSize: isMobile ? 44 : 58,
      lineHeight: 1.08,
      fontWeight: 900,
      letterSpacing: -1.5,
      textShadow: '0 8px 22px rgba(0,0,0,0.28)'
    },
    overviewLead: {
      margin: 0,
      fontSize: isMobile ? 18 : 20,
      lineHeight: 1.52,
      color: 'rgba(255,255,255,0.9)'
    },
    overviewStatusCard: {
      position: 'relative',
      zIndex: 1,
      justifySelf: isDesktop ? 'end' : 'stretch',
      width: isDesktop ? 480 : 'auto',
      maxWidth: '100%',
      padding: isMobile ? 26 : 34,
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))',
      border: '1px solid rgba(255,255,255,0.36)',
      boxShadow: '0 24px 56px rgba(0,62,73,0.24)',
      backdropFilter: 'blur(12px)',
      display: 'grid',
      gap: 26
    },
    statusHeader: { display: 'grid', gridTemplateColumns: '58px minmax(0,1fr)', gap: 18, alignItems: 'center' },
    statusCopy: { display: 'grid', gap: 24, minWidth: 0 },
    statusIcon: {
      width: 58,
      height: 58,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, #57efe7)`,
      fontWeight: 900,
      color: '#ffffff',
      boxShadow: '0 12px 26px rgba(0,0,0,0.18)'
    },
    quotaRow: {
      display: 'grid',
      gridTemplateColumns: '68px minmax(0,1fr)',
      gap: 18,
      alignItems: 'center',
      paddingTop: 22,
      borderTop: '1px solid rgba(255,255,255,0.18)'
    },
    quotaCopy: { display: 'grid', gap: 6, minWidth: 0 },
    quotaRing: {
      width: 56,
      height: 56,
      borderRadius: 999,
      border: '10px solid rgba(255,255,255,0.35)',
      borderLeftColor: '#61fff0',
      borderBottomColor: '#61fff0',
      display: 'inline-block'
    },
    overviewCard: {
      position: 'relative',
      zIndex: 2,
      margin: isMobile ? '-56px 18px 24px' : '-66px 50px 34px',
      padding: isMobile ? 24 : 40,
      borderRadius: 14,
      background: '#ffffff',
      boxShadow: '0 26px 70px rgba(15,23,42,0.14)',
      minWidth: 0
    },
    overviewCardTop: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,0.82fr) minmax(320px,0.72fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 28 : 38,
      alignItems: 'center'
    },
    overviewCardCopy: { minWidth: 0, maxWidth: 650 },
    overviewTitle: {
      margin: '12px 0 18px',
      fontSize: isMobile ? 46 : 68,
      lineHeight: 0.98,
      fontWeight: 900,
      letterSpacing: -2.4,
      color: '#062838',
      textShadow: '0 8px 18px rgba(4,38,52,0.12)'
    },
    overviewBody: {
      margin: 0,
      color: '#39556b',
      lineHeight: 1.48,
      fontSize: isMobile ? 17 : 18,
      maxWidth: 560
    },
    buttonIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      borderRadius: 999,
      border: '1px solid currentColor',
      fontSize: 12,
      lineHeight: 1,
      fontWeight: 900
    },
    buttonArrow: { marginLeft: 8, fontWeight: 900 },
    matchIllustration: {
      position: 'relative',
      minHeight: isMobile ? 230 : 300,
      display: isMobile ? 'none' : 'block'
    },
    radarCircleOuter: {
      position: 'absolute',
      top: 10,
      left: '50%',
      width: 260,
      height: 260,
      marginLeft: -130,
      borderRadius: 999,
      border: '1px solid rgba(39,194,198,0.22)',
      background: 'radial-gradient(circle, rgba(39,194,198,0.16), rgba(39,194,198,0.03) 58%, transparent 60%)'
    },
    radarCircleInner: {
      position: 'absolute',
      top: 62,
      left: '50%',
      width: 156,
      height: 156,
      marginLeft: -78,
      borderRadius: 999,
      border: '1px dashed rgba(39,194,198,0.35)'
    },
    radarCrossHorizontal: {
      position: 'absolute',
      top: 140,
      left: '50%',
      width: 270,
      height: 1,
      marginLeft: -135,
      background: 'rgba(39,194,198,0.16)'
    },
    radarCrossVertical: {
      position: 'absolute',
      top: 10,
      left: '50%',
      width: 1,
      height: 260,
      background: 'rgba(39,194,198,0.16)'
    },
    matchCheck: {
      position: 'absolute',
      top: 112,
      left: '50%',
      width: 54,
      height: 54,
      marginLeft: -27,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900,
      boxShadow: '0 18px 30px rgba(0,116,124,0.24)'
    },
    profileChip: {
      position: 'absolute',
      width: 190,
      minHeight: 54,
      display: 'grid',
      gridTemplateColumns: '36px minmax(0,1fr)',
      gap: 12,
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      background: '#ffffff',
      border: '1px solid rgba(16,36,46,0.09)',
      boxShadow: '0 16px 38px rgba(15,23,42,0.12)'
    },
    profileChipLeft: { left: 0, top: 128 },
    profileChipRight: { right: 0, top: 58 },
    chipAvatar: {
      width: 34,
      height: 34,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900
    },
    chipLines: { display: 'grid', gap: 8 },
    chipLineLong: { display: 'block', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.14)' },
    chipLineShort: { display: 'block', width: '72%', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.1)' },
    overviewDivider: { height: 1, background: 'rgba(16,36,46,0.12)', margin: isMobile ? '24px 0' : '30px 0 24px' },
    overviewMetrics: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      gap: 24
    },
    hero: { display: 'grid', gridTemplateColumns: isDesktop ? template.heroColumns(metricMinWidth, sectionGap) : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), boxShadow: template.cardShadow, border: template.cardBorder, scrollMarginTop: sectionGap, minWidth: 0 },
    eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    title: { margin: '14px 0 12px', fontSize: effectiveTitleSize, lineHeight: 1.05, fontWeight: 800, overflowWrap: 'anywhere' },
    lead: { margin: 0, color: '#55727b', fontSize: effectiveBodySize, lineHeight: 1.55 },
    heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
    primaryButton: { border: 'none', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', padding: '12px 18px', borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    secondaryButton: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, padding: '12px 18px', borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius, fontWeight: 800, cursor: 'pointer' },
    statsGrid: { display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${metricMinWidth}px,1fr))`, gap: 10, minWidth: 0 },
    metric: {
      background: '#f8fdff',
      border: '1px solid rgba(39,194,198,0.18)',
      borderRadius,
      padding: compactCardPadding,
      minHeight: metricMinHeight,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      minWidth: 0,
      overflowWrap: 'anywhere',
      boxShadow: '0 14px 30px rgba(15,23,42,0.04)'
    },
    metricIcon: {
      width: 76,
      height: 76,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900,
      fontSize: 24,
      boxShadow: '0 14px 26px rgba(0,116,124,0.18)'
    },
    metricCopy: { display: 'grid', gap: 4, minWidth: 0 },
    missionFrame: {
      position: 'relative',
      display: 'grid',
      minWidth: 0,
      overflow: 'hidden',
      background: '#eef7fb',
      borderRadius: isCockpitSaas ? 0 : template.cardRadius(borderRadius),
      scrollMarginTop: sectionGap
    },
    missionHero: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,0.86fr) minmax(520px,1fr)' : 'minmax(0,1fr)',
      gridTemplateRows: isDesktop ? 'auto 1fr' : undefined,
      gap: isMobile ? 22 : 26,
      alignItems: 'center',
      padding: isMobile ? '42px 24px 88px' : '70px 70px 124px',
      minHeight: isMobile ? 520 : 390,
      color: '#ffffff',
      background: `radial-gradient(circle at 92% 18%, rgba(99,255,235,0.78), transparent 30%), radial-gradient(circle at 70% 100%, rgba(39,194,198,0.38), transparent 34%), linear-gradient(116deg, #073545 0%, #006b7b 48%, ${primaryColor} 100%)`,
      overflow: 'hidden'
    },
    missionHeroCopy: { position: 'relative', zIndex: 1, alignSelf: 'center' },
    missionKicker: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      color: '#63fff4',
      fontSize: isMobile ? 12 : 15,
      lineHeight: 1.4,
      letterSpacing: 4,
      textTransform: 'uppercase',
      fontWeight: 900
    },
    missionTitle: {
      margin: isMobile ? '20px 0 14px' : '24px 0 18px',
      fontSize: isMobile ? 52 : 72,
      lineHeight: 0.96,
      fontWeight: 900,
      letterSpacing: -2.4,
      textShadow: '0 10px 24px rgba(0,0,0,0.28)'
    },
    missionLead: {
      margin: 0,
      maxWidth: 680,
      fontSize: isMobile ? 18 : 21,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.94)'
    },
    missionHeroActions: {
      position: 'relative',
      zIndex: 1,
      alignSelf: 'start',
      justifySelf: isDesktop ? 'end' : 'start',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16
    },
    missionGhostButton: {
      minWidth: 170,
      minHeight: 50,
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.56)',
      background: 'rgba(255,255,255,0.08)',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontWeight: 900,
      fontSize: 16,
      boxShadow: '0 18px 38px rgba(0,70,82,0.18)',
      backdropFilter: 'blur(10px)'
    },
    missionStats: {
      position: 'relative',
      zIndex: 1,
      gridColumn: isDesktop ? '2' : undefined,
      display: 'grid',
      gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(3,minmax(0,1fr))',
      gap: isMobile ? 14 : 20
    },
    missionStat: {
      minHeight: isMobile ? 150 : 180,
      padding: isMobile ? 20 : 24,
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.34)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.07))',
      boxShadow: '0 20px 46px rgba(0,68,78,0.2)',
      display: 'grid',
      alignContent: 'space-between',
      gap: 10,
      backdropFilter: 'blur(12px)',
      minWidth: 0
    },
    missionStatIcon: {
      width: 52,
      height: 52,
      borderRadius: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.16)',
      color: '#ffffff',
      fontWeight: 900,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
    },
    missionStatProgress: {
      display: 'block',
      height: 4,
      borderRadius: 999,
      background: '#69fff1',
      boxShadow: '80px 0 0 rgba(255,255,255,0.14)'
    },
    missionWorkbench: {
      position: 'relative',
      zIndex: 2,
      margin: isMobile ? '-52px 16px 24px' : '-62px 54px 34px',
      padding: isMobile ? 16 : 18,
      borderRadius: 18,
      background: '#ffffff',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,0.92fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 18 : 22,
      boxShadow: '0 28px 76px rgba(15,23,42,0.16)',
      minWidth: 0
    },
    missionComposer: {
      borderRadius: 16,
      padding: isMobile ? 18 : 22,
      background: '#ffffff',
      border: '1px solid rgba(16,36,46,0.08)',
      boxShadow: '0 16px 42px rgba(15,23,42,0.06)',
      display: 'grid',
      gap: 16,
      minWidth: 0
    },
    missionHistoryPanel: {
      borderRadius: 16,
      padding: isMobile ? 18 : 22,
      background: '#ffffff',
      border: '1px solid rgba(16,36,46,0.08)',
      boxShadow: '0 16px 42px rgba(15,23,42,0.06)',
      display: 'grid',
      gap: 14,
      alignContent: 'start',
      minWidth: 0
    },
    missionPanelHeader: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '44px minmax(0,1fr)' : '44px minmax(0,1fr) auto',
      gap: 14,
      alignItems: 'center',
      minWidth: 0
    },
    missionPanelIcon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900,
      boxShadow: '0 12px 24px rgba(0,116,124,0.2)'
    },
    missionPanelTitle: { margin: 0, color: '#10242e', fontSize: isMobile ? 20 : 22, lineHeight: 1.15, fontWeight: 900 },
    missionPanelKicker: { display: 'block', marginTop: 4, color: '#4b6170', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 900 },
    aiPill: {
      border: '1px solid rgba(39,194,198,0.28)',
      background: '#ffffff',
      color: secondaryColor,
      borderRadius: 999,
      padding: '10px 18px',
      fontWeight: 900,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    missionTextareaWrap: { position: 'relative', minWidth: 0 },
    missionTextarea: {
      width: '100%',
      minHeight: isMobile ? 160 : 176,
      resize: 'vertical',
      borderRadius: 10,
      border: '1px solid rgba(16,36,46,0.14)',
      background: '#ffffff',
      padding: isMobile ? '18px' : '26px 22px',
      font: 'inherit',
      fontSize: isMobile ? 16 : 17,
      color: accentTextColor,
      boxSizing: 'border-box',
      boxShadow: 'inset 0 1px 0 rgba(16,36,46,0.03)'
    },
    textareaHint: {
      position: 'absolute',
      right: 54,
      bottom: 22,
      width: 22,
      height: 22,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#57707a',
      border: '1px solid rgba(16,36,46,0.2)',
      fontWeight: 900
    },
    grammarBadge: {
      position: 'absolute',
      right: 24,
      bottom: 18,
      width: 34,
      height: 34,
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0b8b77',
      border: '3px solid rgba(11,139,119,0.28)',
      fontWeight: 900,
      background: '#ffffff'
    },
    dropZone: {
      display: 'grid',
      gridTemplateColumns: '54px minmax(0,1fr)',
      gap: 14,
      alignItems: 'center',
      padding: isMobile ? 18 : 22,
      borderRadius: 10,
      border: '1px dashed rgba(39,194,198,0.56)',
      background: 'linear-gradient(135deg, rgba(39,194,198,0.06), rgba(255,255,255,0.9))',
      color: accentTextColor,
      cursor: 'pointer'
    },
    dropZoneBusy: { opacity: 0.64, cursor: 'wait' },
    hiddenInput: { display: 'none' },
    dropIcon: {
      width: 44,
      height: 44,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: primaryColor,
      border: '3px solid rgba(39,194,198,0.36)',
      fontWeight: 900
    },
    extractedSkills: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 },
    extractedSkill: {
      border: 'none',
      borderRadius: 9,
      background: '#eaf8fb',
      color: secondaryColor,
      padding: '10px 16px',
      cursor: 'pointer',
      display: 'inline-flex',
      gap: 9,
      alignItems: 'center',
      fontWeight: 900
    },
    missionActionRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,0.84fr) minmax(0,1fr)', gap: 14 },
    extractButton: {
      minHeight: 54,
      borderRadius: 10,
      border: '1px solid rgba(16,36,46,0.14)',
      background: '#ffffff',
      color: '#39556b',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontSize: 17,
      fontWeight: 900
    },
    launchButton: {
      minHeight: 54,
      borderRadius: 10,
      border: 'none',
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontSize: 17,
      fontWeight: 900,
      boxShadow: '0 16px 28px rgba(0,116,124,0.18)'
    },
    missionFilters: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) auto minmax(150px,0.5fr) minmax(160px,0.5fr)' : 'minmax(0,1fr)', gap: 10 },
    missionSkillInput: { border: '1px solid rgba(16,36,46,0.14)', borderRadius: 10, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box' },
    missionSelect: { border: '1px solid rgba(16,36,46,0.14)', borderRadius: 10, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box', background: '#ffffff' },
    criteriaList: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    criteriaPill: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 999,
      padding: '8px 11px',
      background: 'rgba(39,194,198,0.12)',
      color: secondaryColor,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: '0.03em'
    },
    editingBadge: {
      marginLeft: 'auto',
      borderRadius: 999,
      padding: '8px 12px',
      background: 'rgba(39,194,198,0.12)',
      color: secondaryColor,
      fontSize: 12,
      fontWeight: 900,
      whiteSpace: 'nowrap'
    },
    disabledButton: { opacity: 0.58, cursor: 'not-allowed', boxShadow: 'none' },
    viewAllButton: { border: 'none', background: 'transparent', color: secondaryColor, cursor: 'pointer', fontWeight: 900 },
    missionHistoryList: { display: 'grid', gap: 14 },
    historyCard: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '58px minmax(0,1fr)',
      gap: 16,
      padding: isMobile ? 16 : 20,
      borderRadius: 12,
      border: '1px solid rgba(16,36,46,0.08)',
      background: '#ffffff',
      boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
      minWidth: 0
    },
    historyCardFeatured: {
      border: '1px solid rgba(39,194,198,0.56)',
      background: 'linear-gradient(135deg, rgba(39,194,198,0.1), #ffffff 68%)'
    },
    historyIcon: {
      width: 58,
      height: 58,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#dff8fa',
      color: secondaryColor,
      fontWeight: 900,
      fontSize: 18
    },
    historyContent: { display: 'grid', gap: 10, minWidth: 0 },
    historyTop: { display: 'flex', justifyContent: 'space-between', gap: 12, minWidth: 0 },
    historyTitle: { margin: 0, color: accentTextColor, fontSize: isMobile ? 17 : 18, lineHeight: 1.2, fontWeight: 900 },
    historyMeta: { margin: '6px 0 0', color: '#506775', fontSize: 13 },
    historyMenuWrap: { position: 'relative', flex: '0 0 auto' },
    historyMenuButton: {
      border: 'none',
      borderRadius: 999,
      background: 'rgba(16,36,46,0.06)',
      color: '#4b6170',
      cursor: 'pointer',
      fontWeight: 900,
      letterSpacing: 2,
      width: 34,
      height: 34,
      lineHeight: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    historyMenuPanel: {
      position: 'absolute',
      right: 0,
      top: 40,
      zIndex: 20,
      width: 178,
      display: 'grid',
      gap: 4,
      padding: 8,
      borderRadius: 12,
      border: '1px solid rgba(16,36,46,0.12)',
      background: '#ffffff',
      boxShadow: '0 18px 34px rgba(15,23,42,0.16)'
    },
    historyMenuAction: {
      border: 'none',
      borderRadius: 9,
      background: 'transparent',
      color: accentTextColor,
      padding: '10px 12px',
      textAlign: 'left',
      cursor: 'pointer',
      fontWeight: 800
    },
    historyMenuDanger: { color: '#b42318' },
    historyBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
    historyCriteria: { margin: 0, color: '#415867', lineHeight: 1.45, fontSize: 14 },
    reuseButton: {
      justifySelf: 'end',
      border: 'none',
      borderRadius: 9,
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      padding: '12px 18px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontWeight: 900
    },
    pageFrame: {
      position: 'relative',
      display: 'grid',
      minWidth: 0,
      overflow: 'hidden',
      background: '#eef7fb',
      borderRadius: isCockpitSaas ? 0 : template.cardRadius(borderRadius),
      scrollMarginTop: sectionGap
    },
    pageHero: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,0.95fr) minmax(360px,0.72fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 22 : 34,
      alignItems: 'center',
      padding: isMobile ? '34px 22px 70px' : '46px 60px 86px',
      background: `radial-gradient(circle at 86% 36%, rgba(72,255,238,0.62), transparent 28%), linear-gradient(118deg, #073541 0%, #0b6970 54%, ${primaryColor} 100%)`,
      color: '#ffffff'
    },
    pageKicker: {
      display: 'inline-block',
      color: '#67fbf1',
      fontSize: isMobile ? 11 : 13,
      lineHeight: 1.5,
      letterSpacing: 2.6,
      textTransform: 'uppercase',
      fontWeight: 900
    },
    pageTitle: {
      margin: isMobile ? '14px 0 12px' : '18px 0 14px',
      fontSize: isMobile ? 40 : 56,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: -1.7,
      textShadow: '0 8px 22px rgba(0,0,0,0.26)'
    },
    pageLead: {
      margin: 0,
      maxWidth: 720,
      fontSize: isMobile ? 16 : 19,
      lineHeight: 1.55,
      color: 'rgba(255,255,255,0.9)'
    },
    pageStats: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(3,minmax(0,1fr))',
      gap: 12,
      alignSelf: 'stretch'
    },
    pageStat: {
      minHeight: isMobile ? 92 : 122,
      padding: isMobile ? 16 : 20,
      borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))',
      border: '1px solid rgba(255,255,255,0.34)',
      boxShadow: '0 18px 42px rgba(0,62,73,0.18)',
      display: 'grid',
      alignContent: 'space-between',
      gap: 16,
      minWidth: 0,
      overflowWrap: 'anywhere',
      backdropFilter: 'blur(10px)'
    },
    pageBody: {
      position: 'relative',
      zIndex: 1,
      margin: isMobile ? '-44px 16px 24px' : '-52px 42px 34px',
      padding: isMobile ? 18 : 28,
      borderRadius: 16,
      background: '#ffffff',
      boxShadow: '0 26px 70px rgba(15,23,42,0.13)',
      minWidth: 0
    },
    complianceGrid: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      gap: 14
    },
    searchBand: { background: '#fff', borderRadius, boxShadow: '0 16px 34px rgba(15,23,42,0.07)', scrollMarginTop: sectionGap, minWidth: 0 },
    searchHeader: { padding: `${compactCardPadding}px ${compactCardPadding}px 0` },
    searchGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, minWidth: 0 },
    sectionTitle: { margin: 0, fontSize: isMobile ? 24 : 28, lineHeight: 1.15, fontWeight: 800 },
    muted: { margin: '8px 0 0', color: template.mutedTextColor, lineHeight: 1.5 },
    statusText: { margin: '0', color: secondaryColor, fontWeight: 700, lineHeight: 1.45 },
    errorText: { margin: '0', color: '#b42318', fontWeight: 700, lineHeight: 1.45 },
    panel: { background: template.panelBackground, border: template.cardBorder, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 14, minWidth: 0, boxShadow: '0 14px 30px rgba(15,23,42,0.04)' },
    textarea: { minHeight: isMobile ? 112 : 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', boxSizing: 'border-box', width: '100%', minWidth: 0 },
    inputRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto', gap: 10, minWidth: 0 },
    input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box' },
    chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
    chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
    twoColumn: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 12 },
    workflow: { display: 'grid', gap: 10 },
    workflowStep: { display: 'grid', gridTemplateColumns: '42px minmax(0,1fr)', gap: 12, alignItems: 'start', padding: 16, background: '#fff', borderRadius, border: '1px solid rgba(39,194,198,0.16)', boxShadow: '0 12px 28px rgba(15,23,42,0.04)', minWidth: 0 },
    adminGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.2fr) minmax(280px,0.8fr)' : 'minmax(0,1fr)', gap: sectionGap, marginTop: 18, minWidth: 0 },
    configList: { display: 'grid', gap: 10, lineHeight: 1.45, overflowWrap: 'anywhere' },
    missionList: { display: 'grid', gap: 12 },
    missionCard: { background: '#fff', border: '1px solid rgba(39,194,198,0.16)', borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 10, minWidth: 0, boxShadow: '0 12px 28px rgba(15,23,42,0.04)' },
    missionHeader: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 10, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
    resultBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 72, padding: '8px 10px', borderRadius: 999, background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', fontWeight: 800 },
    resultsLayout: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.4fr) minmax(280px,360px)' : 'minmax(0,1fr)', gap: sectionGap, scrollMarginTop: sectionGap, minWidth: 0 },
    resultsPanel: { background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, boxShadow: template.cardShadow, border: template.cardBorder, scrollMarginTop: sectionGap, minWidth: 0 },
    resultList: { display: 'grid', gap: 14, marginTop: 18 },
    cvCard: { border: '1px solid rgba(39,194,198,0.16)', borderRadius, padding: compactCardPadding, background: '#fdfefe', minWidth: 0, boxShadow: '0 16px 34px rgba(15,23,42,0.05)' },
    cvTop: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 16, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
    candidateId: { display: 'inline-block', background: 'rgba(39,194,198,0.12)', color: secondaryColor, borderRadius: 999, padding: '7px 10px', fontWeight: 800, fontSize: 12 },
    cardTitle: { margin: '10px 0 0', fontSize: isMobile ? 21 : 24, lineHeight: 1.15, overflowWrap: 'anywhere' },
    scoreBox: { minWidth: 96, textAlign: isMobile ? 'left' : 'right', background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: 12 },
    profileSummary: { margin: '12px 0', color: '#55727b', lineHeight: 1.5 },
    skillPills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
    skillPill: { background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 999, padding: '6px 9px', fontSize: 12, fontWeight: 700 },
    cardActions: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 },
    asideStack: { display: 'grid', gap: 18, alignContent: 'start' },
    planList: { display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)', gap: 16 },
    plan: { border: '1px solid rgba(39,194,198,0.16)', borderRadius, padding: compactCardPadding, background: '#fdfefe', boxShadow: '0 16px 34px rgba(15,23,42,0.05)' },
    featuredPlan: { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', borderColor: 'transparent' },
    planTitle: { margin: 0, fontSize: 21 },
    planCopy: { margin: '8px 0', lineHeight: 1.45 },
    price: { display: 'block', fontSize: 30, margin: '10px 0' },
    featureList: { margin: 0, paddingLeft: 18, lineHeight: 1.7 },
    previewOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      padding: isMobile ? 12 : 28,
      background: 'rgba(7,22,31,0.62)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    previewDialog: {
      width: isMobile ? '100%' : 'min(1120px, 92vw)',
      height: isMobile ? '92vh' : '88vh',
      borderRadius: isMobile ? 16 : 22,
      background: '#ffffff',
      boxShadow: '0 34px 90px rgba(0,0,0,0.34)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr) auto',
      overflow: 'hidden',
      minWidth: 0
    },
    previewHeader: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: 14,
      padding: isMobile ? 16 : 22,
      borderBottom: '1px solid rgba(16,36,46,0.1)',
      background: 'linear-gradient(135deg, rgba(39,194,198,0.08), rgba(255,255,255,0.96))'
    },
    previewTitle: {
      margin: '4px 0 0',
      color: accentTextColor,
      fontSize: isMobile ? 20 : 26,
      lineHeight: 1.12,
      fontWeight: 900,
      overflowWrap: 'anywhere'
    },
    previewActions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: isMobile ? 'stretch' : 'flex-end'
    },
    previewCloseButton: {
      border: 'none',
      borderRadius,
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      padding: '12px 18px',
      fontWeight: 900,
      cursor: 'pointer'
    },
    previewFrame: {
      width: '100%',
      height: '100%',
      border: 'none',
      background: '#f8fbfc'
    },
    previewHelp: {
      margin: 0,
      padding: isMobile ? '10px 16px' : '12px 22px',
      color: '#55727b',
      fontSize: 13,
      lineHeight: 1.4,
      borderTop: '1px solid rgba(16,36,46,0.08)'
    }
  };
}
