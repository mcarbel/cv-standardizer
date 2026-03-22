import * as React from 'react';
import type { ICvStandardizerWebPartProps } from '../models/IWebPartProps';
import type { JobRecord } from '../models/ApiModels';
import { ApiClient } from '../services/ApiClient';
import AdminPanel, { type AdminSettings, type ConnectionTestState } from './AdminPanel';
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
    apiKey: webPartProps.apiKey
  }), [
    webPartProps.apiBaseUrl,
    webPartProps.providerBaseUrl,
    webPartProps.defaultModel,
    webPartProps.apiKey
  ]);
  const [adminSettings, setAdminSettings] = React.useState<AdminSettings>(() => loadAdminSettings(defaultSettings));
  const [adminVisible, setAdminVisible] = React.useState<boolean>(false);
  const [job, setJob] = React.useState<JobRecord | undefined>();
  const client = React.useMemo(() => new ApiClient(adminSettings.apiBaseUrl), [adminSettings.apiBaseUrl]);

  React.useEffect(() => {
    setAdminSettings(loadAdminSettings(defaultSettings));
  }, [defaultSettings]);

  function saveAdminSettings(settings: AdminSettings): void {
    setAdminSettings(settings);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function resetAdminSettings(): void {
    setAdminSettings(defaultSettings);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function testConnections(settings: AdminSettings): Promise<ConnectionTestState> {
    const runtimeClient = new ApiClient(settings.apiBaseUrl);
    const result = await runtimeClient.testConnections(settings.providerBaseUrl);
    return {
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
  }

  async function handleUpload(file: File): Promise<void> {
    const created = await client.createJob(file, {
      provider: webPartProps.defaultProvider,
      model: adminSettings.defaultModel,
      outputFormat: webPartProps.outputFormat,
      providerBaseUrl: adminSettings.providerBaseUrl,
      apiKey: adminSettings.apiKey,
      dumpJson: webPartProps.dumpJson
    });

    setJob({
      jobId: created.jobId,
      status: created.status,
      progress: 0
    });
  }

  React.useEffect(() => {
    if (!job?.jobId || job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const timer = window.setInterval(async () => {
      const next = await client.getJob(job.jobId);
      setJob(next);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [client, job]);

  return (
    <section>
      <h2>CV Standardizer</h2>
      <p>Provider: {webPartProps.defaultProvider}</p>
      <p>Model: {adminSettings.defaultModel}</p>
      <p>API URL: {adminSettings.apiBaseUrl}</p>
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
      <ResultPreview resultUrl={job?.outputDownloadUrl} jsonUrl={job?.jsonDownloadUrl} />
    </section>
  );
}

function loadAdminSettings(defaultSettings: AdminSettings): AdminSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AdminSettings>;
    return {
      apiBaseUrl: parsed.apiBaseUrl || defaultSettings.apiBaseUrl,
      providerBaseUrl: parsed.providerBaseUrl || defaultSettings.providerBaseUrl,
      defaultModel: parsed.defaultModel || defaultSettings.defaultModel,
      apiKey: parsed.apiKey || defaultSettings.apiKey
    };
  } catch (_error) {
    return defaultSettings;
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
