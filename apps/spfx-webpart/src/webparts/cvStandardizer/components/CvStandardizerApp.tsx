import * as React from 'react';
import type { ICvStandardizerWebPartProps } from '../models/IWebPartProps';
import type { JobRecord } from '../models/ApiModels';
import { ApiClient } from '../services/ApiClient';
import AdminPanel, { type AdminSettings, type ConnectionTestState } from './AdminPanel';
import DebugPanel, { type DebugEntry } from './DebugPanel';
import JobStatusPanel from './JobStatusPanel';
import ResultPreview from './ResultPreview';
import UploadPanel from './UploadPanel';

interface Props {
  webPartProps: ICvStandardizerWebPartProps;
}

const STORAGE_KEY = 'cv-standardizer-admin-settings';

export default function CvStandardizerApp({ webPartProps }: Props): JSX.Element {
  const defaultSettings = React.useMemo<AdminSettings>(() => ({
    apiBaseUrl: webPartProps.apiBaseUrl,
    providerBaseUrl: webPartProps.providerBaseUrl,
    defaultModel: webPartProps.defaultModel,
    apiKey: webPartProps.apiKey,
    outputLanguage: webPartProps.outputLanguage,
    templateStyle: webPartProps.templateStyle,
    anonymizeCandidateName: webPartProps.anonymizeCandidateName,
    titleColor: webPartProps.titleColor,
    subtitleColor: webPartProps.subtitleColor,
    bodyColor: webPartProps.bodyColor,
    sectionColor: webPartProps.sectionColor
  }), [
    webPartProps.apiBaseUrl,
    webPartProps.providerBaseUrl,
    webPartProps.defaultModel,
    webPartProps.apiKey,
    webPartProps.outputLanguage,
    webPartProps.templateStyle,
    webPartProps.anonymizeCandidateName,
    webPartProps.titleColor,
    webPartProps.subtitleColor,
    webPartProps.bodyColor,
    webPartProps.sectionColor
  ]);
  const [adminSettings, setAdminSettings] = React.useState<AdminSettings>(() => loadStoredAdminSettings() || defaultSettings);
  const [settingsSource, setSettingsSource] = React.useState<'webpart' | 'browser'>(
    () => (loadStoredAdminSettings() ? 'browser' : 'webpart')
  );
  const [adminVisible, setAdminVisible] = React.useState<boolean>(false);
  const [job, setJob] = React.useState<JobRecord | undefined>();
  const [debugEntries, setDebugEntries] = React.useState<DebugEntry[]>([]);
  const effectiveApiBaseUrl = React.useMemo(() => adminSettings.apiBaseUrl, [adminSettings.apiBaseUrl]);
  const client = React.useMemo(() => new ApiClient(effectiveApiBaseUrl), [effectiveApiBaseUrl]);

  React.useEffect(() => {
    setAdminSettings(defaultSettings);
    setSettingsSource('webpart');
    window.localStorage.removeItem(STORAGE_KEY);
  }, [defaultSettings]);

  function saveAdminSettings(settings: AdminSettings): void {
    setAdminSettings(settings);
    setSettingsSource('browser');
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function resetAdminSettings(): void {
    setAdminSettings(defaultSettings);
    setSettingsSource('webpart');
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const pushDebugEntry = React.useCallback((stage: string, message: string, payload?: unknown, level: 'info' | 'error' = 'info') => {
    setDebugEntries((current) => [
      {
        id: `${Date.now()}-${current.length}`,
        time: new Date().toLocaleTimeString(),
        stage,
        message,
        payload,
        level
      },
      ...current
    ]);
  }, []);

  async function testConnections(settings: AdminSettings): Promise<ConnectionTestState> {
    const runtimeClient = new ApiClient(settings.apiBaseUrl);
    const health = await runtimeClient.healthCheck();
    pushDebugEntry('health-check.response', 'Received backend health check response.', health, health.ok ? 'info' : 'error');

    if (!health.ok) {
      return {
        healthOk: false,
        healthUrl: health.url,
        healthStatusCode: health.status,
        healthPayload: health.payload,
        healthDiagnosis: health.diagnosis,
        apiOk: false,
        ollamaOk: false,
        apiUrl: health.url,
        ollamaUrl: settings.providerBaseUrl,
        apiServerTime: '',
        apiNodeVersion: '',
        apiDefaultOllamaBaseUrl: ''
      };
    }

    pushDebugEntry('test-connections.request', 'Testing backend and Ollama connectivity.', {
      apiBaseUrl: settings.apiBaseUrl,
      providerBaseUrl: settings.providerBaseUrl
    });
    try {
      const result = await runtimeClient.testConnections(settings.providerBaseUrl);
      pushDebugEntry('test-connections.response', 'Received backend connectivity diagnostics.', result);
      return {
        healthOk: true,
        healthUrl: health.url,
        healthStatusCode: health.status,
        healthPayload: health.payload,
        apiOk: result.api.ok,
        ollamaOk: result.ollama.ok,
        apiUrl: result.api.url,
        ollamaUrl: result.ollama.url,
        apiServerTime: result.api.serverTime,
        apiNodeVersion: result.api.nodeVersion,
        apiDefaultOllamaBaseUrl: result.api.defaultOllamaBaseUrl,
        ollamaStatusCode: result.ollama.statusCode,
        ollamaModelCount: result.ollama.modelCount,
        ollamaMessage: result.ollama.message,
        ollamaModels: result.ollama.models
      };
    } catch (error) {
      pushDebugEntry(
        'test-connections.error',
        error instanceof Error ? error.message : 'Connectivity test failed.',
        undefined,
        'error'
      );
      throw error;
    }
  }

  async function handleUpload(file: File): Promise<void> {
    const requestPayload = {
      provider: webPartProps.defaultProvider,
      model: adminSettings.defaultModel,
      outputFormat: webPartProps.outputFormat,
      outputLanguage: adminSettings.outputLanguage,
      templateStyle: adminSettings.templateStyle,
      anonymizeCandidateName: adminSettings.anonymizeCandidateName,
      titleColor: adminSettings.titleColor,
      subtitleColor: adminSettings.subtitleColor,
      bodyColor: adminSettings.bodyColor,
      sectionColor: adminSettings.sectionColor,
      providerBaseUrl: adminSettings.providerBaseUrl,
      apiKey: maskApiKey(adminSettings.apiKey),
      dumpJson: webPartProps.dumpJson
    };
    pushDebugEntry('upload.selected', 'User selected a CV file.', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    pushDebugEntry('jobs.create.request', 'Sending create job request to backend.', requestPayload);

    try {
      const health = await client.healthCheck();
      pushDebugEntry('health-check.response', 'Received backend health check response before create job.', health, health.ok ? 'info' : 'error');
      if (!health.ok) {
        throw new Error(health.diagnosis || 'Backend health check failed.');
      }

      const created = await client.createJob(file, {
        provider: webPartProps.defaultProvider,
        model: adminSettings.defaultModel,
        outputFormat: webPartProps.outputFormat,
        outputLanguage: adminSettings.outputLanguage,
        templateStyle: adminSettings.templateStyle,
        anonymizeCandidateName: adminSettings.anonymizeCandidateName,
        titleColor: adminSettings.titleColor,
        subtitleColor: adminSettings.subtitleColor,
        bodyColor: adminSettings.bodyColor,
        sectionColor: adminSettings.sectionColor,
        providerBaseUrl: adminSettings.providerBaseUrl,
        apiKey: adminSettings.apiKey,
        dumpJson: webPartProps.dumpJson
      });

      pushDebugEntry('jobs.create.response', 'Received create job response from backend.', created);

      setJob({
        jobId: created.jobId,
        status: created.status,
        progress: created.progress
      });
    } catch (error) {
      pushDebugEntry(
        'jobs.create.error',
        error instanceof Error ? error.message : 'Failed to create job.',
        undefined,
        'error'
      );
      throw error;
    }
  }

  React.useEffect(() => {
    if (!job?.jobId || job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const next = await client.getJob(job.jobId);
        pushDebugEntry('jobs.poll.response', `Polled backend for job ${job.jobId}.`, next);
        setJob(next);
      } catch (error) {
        pushDebugEntry(
          'jobs.poll.error',
          error instanceof Error ? error.message : 'Failed to poll job status.',
          undefined,
          'error'
        );
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [client, job]);

  return (
    <section>
      <h2>CV Standardizer</h2>
      <p>Provider: {webPartProps.defaultProvider}</p>
      <p>Model: {adminSettings.defaultModel}</p>
      <p>Output language: {adminSettings.outputLanguage === 'fr' ? 'French' : 'English'}</p>
      <p>Template: {adminSettings.templateStyle}</p>
      <p>API URL: {effectiveApiBaseUrl}</p>
      <p>Settings source: {settingsSource === 'browser' ? 'browser overrides' : 'web part properties'}</p>
      {webPartProps.useLocalApiProxy ? <p>Proxy mode: prepared in configuration, but current runtime still uses the configured backend URL directly.</p> : null}
      <button type="button" style={styles.toggleButton} onClick={() => setAdminVisible(!adminVisible)}>
        {adminVisible ? 'Hide Admin Settings' : 'Show Admin Settings'}
      </button>
      {adminVisible ? (
        <AdminPanel
          initialSettings={adminSettings}
          onSave={saveAdminSettings}
          onReset={resetAdminSettings}
          onTestConnections={testConnections}
        />
      ) : null}
      <UploadPanel onUpload={handleUpload} />
      <JobStatusPanel
        jobId={job?.jobId}
        status={job?.status}
        progress={job?.progress}
        errorMessage={job?.errorMessage}
      />
      <ResultPreview
        apiBaseUrl={effectiveApiBaseUrl}
        resultUrl={job?.outputDownloadUrl}
        jsonUrl={job?.jsonDownloadUrl}
      />
      {webPartProps.enableDebugPanel ? (
        <DebugPanel entries={debugEntries} onClear={() => setDebugEntries([])} />
      ) : null}
    </section>
  );
}

function loadStoredAdminSettings(): AdminSettings | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AdminSettings>;
    return {
      apiBaseUrl: parsed.apiBaseUrl || '',
      providerBaseUrl: parsed.providerBaseUrl || '',
      defaultModel: parsed.defaultModel || '',
      apiKey: parsed.apiKey || '',
      outputLanguage: (parsed.outputLanguage as AdminSettings['outputLanguage']) || 'en',
      templateStyle: (parsed.templateStyle as AdminSettings['templateStyle']) || 'standard',
      anonymizeCandidateName: Boolean(parsed.anonymizeCandidateName),
      titleColor: parsed.titleColor || '',
      subtitleColor: parsed.subtitleColor || '',
      bodyColor: parsed.bodyColor || '',
      sectionColor: parsed.sectionColor || ''
    };
  } catch (_error) {
    return undefined;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  toggleButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #94a3b8',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    cursor: 'pointer',
    marginBottom: '16px'
  }
};

function maskApiKey(value: string): string {
  if (!value) {
    return '';
  }

  if (value.length <= 8) {
    return '***';
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
