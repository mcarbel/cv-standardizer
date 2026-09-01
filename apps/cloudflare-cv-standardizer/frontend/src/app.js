const form = document.querySelector('#jobForm');
const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');
const fileName = document.querySelector('#fileName');
const debugLog = document.querySelector('#debugLog');
const jobId = document.querySelector('#jobId');
const jobStatus = document.querySelector('#jobStatus');
const jobProgress = document.querySelector('#jobProgress');
const progressBar = document.querySelector('#progressBar');
const jsonLink = document.querySelector('#jsonLink');
const resultLink = document.querySelector('#resultLink');
const apiBaseUrlInput = document.querySelector('#apiBaseUrl');
const providerSelect = document.querySelector('#provider');
const providerBaseUrlInput = document.querySelector('#providerBaseUrl');
const modelInput = document.querySelector('#model');
const modelHint = document.querySelector('#modelHint');
const ollamaModelSelect = document.querySelector('#ollamaModelSelect');
const refreshModelsButton = document.querySelector('#refreshModelsButton');
const originalPreview = document.querySelector('#originalPreview');
const finalPreview = document.querySelector('#finalPreview');
const originalPreviewMeta = document.querySelector('#originalPreviewMeta');
const finalPreviewMeta = document.querySelector('#finalPreviewMeta');
const finalActions = document.querySelector('#finalActions');
const finalDownloadButton = document.querySelector('#finalDownloadButton');
const sendEmailButton = document.querySelector('#sendEmailButton');
const advancedSettings = document.querySelector('#advancedSettings');
const sectionNavLinks = document.querySelectorAll('.nav-orb');

let selectedFile;
let originalPreviewUrl;
let finalPreviewUrl;
let latestResultUrl = '';
let latestResultFileName = '';

fileInput.addEventListener('change', async () => {
  selectedFile = fileInput.files?.[0];
  fileName.textContent = selectedFile ? `${selectedFile.name} · ${formatBytes(selectedFile.size)}` : 'PDF, DOCX, or TXT · Max 10MB';
  if (selectedFile) {
    await renderFilePreview(selectedFile, originalPreview, originalPreviewMeta, 'original');
    resetFinalPreview();
  }
});

for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
  });
}

for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  });
}

dropZone.addEventListener('drop', async (event) => {
  selectedFile = event.dataTransfer.files?.[0];
  if (selectedFile) {
    fileName.textContent = `${selectedFile.name} · ${formatBytes(selectedFile.size)}`;
    await renderFilePreview(selectedFile, originalPreview, originalPreviewMeta, 'original');
    resetFinalPreview();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!selectedFile) {
    log('Select or drop a CV file first.');
    return;
  }

  const apiBaseUrl = cleanBaseUrl(apiBaseUrlInput.value);
  const extractedTextOverride = await extractTextBeforeUpload(selectedFile);
  const data = new FormData();
  data.set('file', selectedFile);
  data.set('provider', providerSelect.value);
  data.set('model', modelInput.value);
  data.set('providerBaseUrl', providerBaseUrlInput.value);
  data.set('templateStyle', document.querySelector('#templateStyle').value);
  data.set('outputLanguage', document.querySelector('#outputLanguage').value);
  data.set('outputFormat', document.querySelector('#outputFormat').value);
  data.set('anonymizeCandidateName', String(document.querySelector('#anonymizeCandidateName').checked));
  data.set('dumpJson', 'true');
  if (extractedTextOverride) {
    data.set('extractedTextOverride', extractedTextOverride);
  }

  log('Creating Cloudflare job...', {
    apiBaseUrl,
    file: selectedFile.name,
    extractedTextCharacters: extractedTextOverride?.length || 0
  });

  const response = await fetch(`${apiBaseUrl}/api/jobs`, { method: 'POST', body: data });
  const payload = await response.json();
  log('Create job response', payload);

  if (!response.ok) {
    jobStatus.textContent = 'failed';
    return;
  }

  renderJob(payload, apiBaseUrl);
  await pollJob(apiBaseUrl, payload.jobId);
});

apiBaseUrlInput.addEventListener('change', () => {
  checkHealth();
  refreshOllamaModelsIfNeeded();
});

providerSelect.addEventListener('change', () => {
  applyProviderUi();
  refreshOllamaModelsIfNeeded();
});

providerBaseUrlInput.addEventListener('change', () => {
  refreshOllamaModelsIfNeeded();
});

ollamaModelSelect.addEventListener('change', () => {
  if (ollamaModelSelect.value) {
    modelInput.value = ollamaModelSelect.value;
  }
});

refreshModelsButton.addEventListener('click', () => {
  refreshOllamaModels();
});

for (const navLink of sectionNavLinks) {
  navLink.addEventListener('click', () => {
    sectionNavLinks.forEach((link) => link.classList.toggle('is-active', link === navLink));
    if (navLink.getAttribute('href') === '#advancedSettings') {
      advancedSettings.open = true;
    }
  });
}

sendEmailButton.addEventListener('click', async () => {
  if (!latestResultUrl) {
    log('No generated CV is available to email yet.');
    return;
  }

  const recipient = window.prompt('Recipient email address');
  if (!recipient) {
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim())) {
    window.alert('Please enter a valid email address.');
    return;
  }

  const subject = `Standardized CV: ${latestResultFileName || 'candidate profile'}`;
  const body = [
    'Hello,',
    '',
    'The standardized CV is attached when supported by your email client. If it is not attached automatically, please attach the downloaded file:',
    latestResultFileName || 'standardized CV',
    '',
    'Secure download link:',
    latestResultUrl,
    '',
    'Best regards'
  ].join('\n');

  log('Preparing email handoff...', {
    recipient: recipient.trim(),
    resultUrl: latestResultUrl
  });

  try {
    const file = await fetchGeneratedCvFile();
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: subject,
        text: body
      });
      log('Email handoff opened with native file sharing.', { fileName: file.name });
      return;
    }

    downloadBlob(file, file.name);
    log('Native file sharing is unavailable; downloaded CV before opening email composer.', { fileName: file.name });
  } catch (error) {
    log('Unable to prepare email attachment; opening composer with link only.', { message: error.message });
  }

  const client = window.prompt('Native attachment is not available in this browser. Type "outlook", "gmail", or "default" to open an email draft.', 'default');
  if (!client) {
    return;
  }

  openEmailComposer(client.trim().toLowerCase(), recipient.trim(), subject, body);
});

checkHealth();
applyProviderUi();
refreshOllamaModelsIfNeeded();

async function checkHealth() {
  const apiBaseUrl = cleanBaseUrl(apiBaseUrlInput.value);
  try {
    const response = await fetch(`${apiBaseUrl}/api/health`);
    const payload = await response.json();
    log('Health check', payload);
  } catch (error) {
    log('Health check failed', { message: error.message });
  }
}

function applyProviderUi() {
  const isOllama = providerSelect.value === 'ollama';
  refreshModelsButton.hidden = !isOllama;
  ollamaModelSelect.hidden = !isOllama;
  modelHint.textContent = isOllama
    ? 'Loading available Ollama models from providerBaseUrl...'
    : 'Free text for OpenAI or heuristic mode. Select Ollama to load local models.';

  if (isOllama && modelInput.value === 'gpt-4.1-mini') {
    modelInput.value = 'glm-5.2:cloud';
    modelInput.placeholder = 'Select or type an Ollama model...';
  } else if (!isOllama && !modelInput.value) {
    modelInput.value = providerSelect.value === 'heuristic' ? 'heuristic' : 'gpt-4.1-mini';
  }
}

async function refreshOllamaModelsIfNeeded() {
  if (providerSelect.value !== 'ollama') {
    ollamaModelSelect.innerHTML = '';
    return;
  }

  await refreshOllamaModels();
}

async function refreshOllamaModels() {
  const apiBaseUrl = cleanBaseUrl(apiBaseUrlInput.value);
  const providerBaseUrl = cleanBaseUrl(providerBaseUrlInput.value);

  refreshModelsButton.disabled = true;
  ollamaModelSelect.disabled = true;
  ollamaModelSelect.innerHTML = '<option value="">Loading Ollama models...</option>';
  modelHint.textContent = 'Loading Ollama models...';
  log('ollama.models.request', { apiBaseUrl, providerBaseUrl });

  try {
    const response = await fetch(`${apiBaseUrl}/api/providers/ollama/models?providerBaseUrl=${encodeURIComponent(providerBaseUrl)}`);
    const payload = await response.json();
    log('ollama.models.response', payload);

    if (!response.ok || !payload.ok) {
      ollamaModelSelect.innerHTML = '<option value="">Unable to load models</option>';
      modelHint.textContent = payload.message || 'Unable to load Ollama models. You can still type the model manually.';
      return;
    }

    ollamaModelSelect.innerHTML = '<option value="">Select an Ollama model...</option>';
    const availableModelNames = (payload.models || []).map((model) => model.name);
    for (const model of payload.models || []) {
      const option = document.createElement('option');
      option.value = model.name;
      option.textContent = model.name;
      ollamaModelSelect.appendChild(option);
    }

    const preferredModel = choosePreferredOllamaModel(availableModelNames);
    if ((!modelInput.value || !availableModelNames.includes(modelInput.value)) && preferredModel) {
      modelInput.value = preferredModel;
      ollamaModelSelect.value = preferredModel;
    } else if (modelInput.value && availableModelNames.includes(modelInput.value)) {
      ollamaModelSelect.value = modelInput.value;
    }

    const retiredHint = payload.unavailableCount ? ` ${payload.unavailableCount} retired/unavailable hidden.` : '';
    modelHint.textContent = payload.count
      ? `${payload.count} Ollama model(s) available.${retiredHint}`
      : 'No Ollama models returned. You can still type the model manually.';
  } catch (error) {
    ollamaModelSelect.innerHTML = '<option value="">Unable to load models</option>';
    modelHint.textContent = 'Unable to load Ollama models. Check tunnel/CORS/network and type the model manually.';
    log('ollama.models.error', { message: error.message });
  } finally {
    refreshModelsButton.disabled = false;
    ollamaModelSelect.disabled = false;
  }
}

async function pollJob(apiBaseUrl, id) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const response = await fetch(`${apiBaseUrl}/api/jobs/${id}`);
    const payload = await response.json();
    log('Job status', payload);
    renderJob(payload, apiBaseUrl);

    if (payload.status === 'completed' || payload.status === 'failed') {
      return;
    }

    await delay(2000);
  }

  log('Polling stopped after timeout.', { jobId: id });
}

function renderJob(job, apiBaseUrl) {
  jobId.textContent = job.jobId || 'Not started';
  jobStatus.textContent = job.status || '-';
  jobProgress.textContent = `${job.progress || 0}%`;
  progressBar.style.width = `${job.progress || 0}%`;

  if (job.jsonDownloadUrl) {
    jsonLink.href = `${apiBaseUrl}${job.jsonDownloadUrl}`;
    jsonLink.hidden = false;
  }

  if (job.outputDownloadUrl) {
    const outputUrl = `${apiBaseUrl}${job.outputDownloadUrl}`;
    latestResultUrl = outputUrl;
    latestResultFileName = inferResultFileName(job);
    resultLink.href = outputUrl;
    resultLink.hidden = false;
    finalActions.hidden = false;
    finalDownloadButton.href = outputUrl;
    finalDownloadButton.download = latestResultFileName;
    finalDownloadButton.hidden = false;
    sendEmailButton.disabled = job.status !== 'completed';
    if (job.status === 'completed') {
      renderRemotePreview(outputUrl, job, finalPreview, finalPreviewMeta);
    }
  }
}

function log(message, payload) {
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  const body = payload ? `${line}\n${JSON.stringify(payload, null, 2)}` : line;
  debugLog.textContent = `${body}\n\n${debugLog.textContent}`;
}

function cleanBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function formatBytes(value) {
  if (!value) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** exponent).toFixed(1)} ${units[exponent]}`;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function renderRemotePreview(url, job, target, metaTarget) {
  if (target.dataset.previewUrl === url) {
    return;
  }

  target.dataset.previewUrl = url;
  target.classList.remove('empty-preview');
  target.innerHTML = '<div class="preview-loading">Loading generated CV preview...</div>';
  metaTarget.textContent = `${job.outputFormat?.toUpperCase() || 'Output'} · ${job.templateStyle || 'template'}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    await renderBlobPreview(blob, inferResultFileName(job), target, metaTarget, 'final');
  } catch (error) {
    target.classList.add('empty-preview');
    target.textContent = `Unable to preview generated CV: ${error.message}`;
    log('Generated preview failed', { message: error.message });
  }
}

async function renderFilePreview(file, target, metaTarget, kind) {
  target.classList.remove('empty-preview');
  target.innerHTML = '<div class="preview-loading">Preparing preview...</div>';
  metaTarget.textContent = `${file.name} · ${formatBytes(file.size)}`;

  try {
    await renderBlobPreview(file, file.name, target, metaTarget, kind);
  } catch (error) {
    target.classList.add('empty-preview');
    target.textContent = `Unable to preview ${file.name}: ${error.message}`;
    log('File preview failed', { file: file.name, message: error.message });
  }
}

async function renderBlobPreview(blob, name, target, metaTarget, kind) {
  const lowerName = name.toLowerCase();
  const contentType = blob.type || '';

  if (contentType.includes('pdf') || lowerName.endsWith('.pdf')) {
    const objectUrl = URL.createObjectURL(blob);
    rememberPreviewUrl(kind, objectUrl);
    target.innerHTML = `<iframe class="preview-frame" title="${escapeHtml(name)} preview" src="${objectUrl}"></iframe>`;
    metaTarget.textContent = `${name} · PDF`;
    return;
  }

  if (contentType.includes('wordprocessingml') || lowerName.endsWith('.docx')) {
    if (!window.mammoth?.convertToHtml) {
      throw new Error('DOCX preview library is not loaded.');
    }

    const result = await window.mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
    target.innerHTML = `<div class="docx-preview">${result.value || '<p>No DOCX text detected.</p>'}</div>`;
    metaTarget.textContent = `${name} · DOCX`;
    return;
  }

  const text = await blob.text();
  target.innerHTML = `<pre class="text-preview">${escapeHtml(text.slice(0, 50000))}</pre>`;
  metaTarget.textContent = `${name} · Text`;
}

function resetFinalPreview() {
  finalPreview.removeAttribute('data-preview-url');
  finalPreview.classList.add('empty-preview');
  finalPreview.textContent = 'The generated CV preview will appear here when processing finishes.';
  finalPreviewMeta.textContent = 'Waiting for processing';
  rememberPreviewUrl('final', undefined);
  jsonLink.hidden = true;
  resultLink.hidden = true;
  finalActions.hidden = true;
  finalDownloadButton.hidden = true;
  finalDownloadButton.removeAttribute('href');
  sendEmailButton.disabled = true;
  latestResultUrl = '';
  latestResultFileName = '';
}

function rememberPreviewUrl(kind, url) {
  if (kind === 'original') {
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    originalPreviewUrl = url;
  } else {
    if (finalPreviewUrl) URL.revokeObjectURL(finalPreviewUrl);
    finalPreviewUrl = url;
  }
}

function inferResultFileName(job) {
  const extension = job.outputFormat === 'markdown' ? 'md' : job.outputFormat || 'txt';
  return `${job.jobId || 'standardized-cv'}.${extension}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function extractTextBeforeUpload(file) {
  const lowerName = file.name.toLowerCase();

  try {
    if (file.type.startsWith('text/') || lowerName.endsWith('.txt')) {
      const text = await file.text();
      return cleanupExtractedText(text);
    }

    if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
      log('Extracting PDF text in browser...', { file: file.name });
      const text = await extractPdfText(file);
      log('PDF text extracted in browser.', { characters: text.length });
      return cleanupExtractedText(text);
    }
  } catch (error) {
    log('Browser text extraction failed; Worker fallback will be used.', { message: error.message });
  }

  return '';
}

async function extractPdfText(file) {
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str || '').join(' '));
  }

  return pages.join('\n\n');
}

function cleanupExtractedText(value) {
  return value
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 50000);
}

function choosePreferredOllamaModel(modelNames) {
  const preferred = ['glm-5.2:cloud', 'kimi-k3:cloud', 'kimi-k2.7-code:cloud', 'gpt-oss:20b'];
  return preferred.find((modelName) => modelNames.includes(modelName)) || modelNames[0] || '';
}

async function fetchGeneratedCvFile() {
  const response = await fetch(latestResultUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const blob = await response.blob();
  return new File([blob], latestResultFileName || 'standardized-cv.pdf', {
    type: blob.type || 'application/octet-stream'
  });
}

function downloadBlob(file, fileName) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openEmailComposer(client, recipient, subject, body) {
  const encodedRecipient = encodeURIComponent(recipient);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (client === 'outlook') {
    window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedBody}`, '_blank', 'noopener');
    return;
  }

  if (client === 'gmail') {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedBody}`, '_blank', 'noopener');
    return;
  }

  window.location.href = `mailto:${encodedRecipient}?subject=${encodedSubject}&body=${encodedBody}`;
}
