import * as React from 'react';

export interface AdminSettings {
  apiBaseUrl: string;
  providerBaseUrl: string;
  defaultModel: string;
  apiKey: string;
  showBackgroundImage: boolean;
  backgroundImageUrl: string;
  outputLanguage: 'en' | 'fr';
  templateStyle: 'standard' | 'modern' | 'consulting';
  anonymizeCandidateName: boolean;
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  sectionColor: string;
}

interface AdminPanelProps {
  initialSettings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
  onReset: () => void;
  onTestConnections: (settings: AdminSettings) => Promise<ConnectionTestState>;
}

export interface ConnectionTestState {
  healthOk?: boolean;
  healthUrl?: string;
  healthStatusCode?: number;
  healthPayload?: unknown;
  healthDiagnosis?: string;
  apiOk: boolean;
  ollamaOk: boolean;
  apiUrl: string;
  ollamaUrl: string;
  apiServerTime: string;
  apiNodeVersion: string;
  apiDefaultOllamaBaseUrl: string;
  ollamaStatusCode?: number;
  ollamaModelCount?: number;
  ollamaMessage?: string;
  ollamaModels?: Array<{
    name: string;
    model: string;
    size: number;
    modifiedAt?: string;
    remoteHost?: string;
  }>;
}

export default function AdminPanel(props: AdminPanelProps): JSX.Element {
  const [settings, setSettings] = React.useState<AdminSettings>(props.initialSettings);
  const [showApiKey, setShowApiKey] = React.useState<boolean>(false);
  const [testResult, setTestResult] = React.useState<ConnectionTestState | undefined>();
  const [testBusy, setTestBusy] = React.useState<boolean>(false);
  const [testError, setTestError] = React.useState<string | undefined>();

  React.useEffect(() => {
    setSettings(props.initialSettings);
  }, [props.initialSettings]);

  function updateField(field: keyof AdminSettings, value: string | boolean): void {
    setSettings({
      ...settings,
      [field]: value
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    props.onSave(settings);
  }

  async function onTestClick(): Promise<void> {
    setTestBusy(true);
    setTestError(undefined);

    try {
      const result = await props.onTestConnections(settings);
      setTestResult(result);
    } catch (error) {
      setTestResult(undefined);
      setTestError(error instanceof Error ? error.message : 'Connection test failed');
    } finally {
      setTestBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={styles.panel}>
      <h3 style={styles.heading}>Admin Settings</h3>
      <p style={styles.description}>
        Edit runtime API settings from the web part UI. These values override the Property Pane defaults for your current browser.
      </p>
      <div style={styles.defaultsBox}>
        <div><strong>Current template defaults</strong></div>
        <div>Background image: {settings.showBackgroundImage ? 'Enabled' : 'Disabled'}</div>
        <div>Background URL: {settings.backgroundImageUrl || 'None'}</div>
        <div>Language: {settings.outputLanguage === 'fr' ? 'French' : 'English'}</div>
        <div>Template: {settings.templateStyle}</div>
        <div>Title: {settings.titleColor}</div>
        <div>Subtitle: {settings.subtitleColor}</div>
        <div>Body: {settings.bodyColor}</div>
        <div>Sections: {settings.sectionColor}</div>
        <div>Anonymize name: {settings.anonymizeCandidateName ? 'Yes' : 'No'}</div>
      </div>

      <label style={styles.label}>
        API Base URL
        <input
          style={styles.input}
          value={settings.apiBaseUrl}
          onChange={(event) => updateField('apiBaseUrl', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Provider Base URL
        <input
          style={styles.input}
          value={settings.providerBaseUrl}
          onChange={(event) => updateField('providerBaseUrl', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Model
        <input
          style={styles.input}
          value={settings.defaultModel}
          onChange={(event) => updateField('defaultModel', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.checkboxLabel}>
        <input
          checked={settings.showBackgroundImage}
          onChange={(event) => updateField('showBackgroundImage', event.target.checked)}
          type="checkbox"
        />
        Show background image
      </label>

      <label style={styles.label}>
        Background image URL
        <input
          style={styles.input}
          value={settings.backgroundImageUrl}
          onChange={(event) => updateField('backgroundImageUrl', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Output language
        <select
          style={styles.input}
          value={settings.outputLanguage}
          onChange={(event) => updateField('outputLanguage', event.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </label>

      <label style={styles.label}>
        Template style
        <select
          style={styles.input}
          value={settings.templateStyle}
          onChange={(event) => updateField('templateStyle', event.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="modern">Modern</option>
          <option value="consulting">Consulting</option>
        </select>
      </label>

      <label style={styles.checkboxLabel}>
        <input
          checked={settings.anonymizeCandidateName}
          onChange={(event) => updateField('anonymizeCandidateName', event.target.checked)}
          type="checkbox"
        />
        Anonymize candidate name
      </label>

      <label style={styles.label}>
        Title color
        <input
          style={styles.input}
          value={settings.titleColor}
          onChange={(event) => updateField('titleColor', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Subtitle color
        <input
          style={styles.input}
          value={settings.subtitleColor}
          onChange={(event) => updateField('subtitleColor', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Body text color
        <input
          style={styles.input}
          value={settings.bodyColor}
          onChange={(event) => updateField('bodyColor', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        Section color
        <input
          style={styles.input}
          value={settings.sectionColor}
          onChange={(event) => updateField('sectionColor', event.target.value)}
          type="text"
        />
      </label>

      <label style={styles.label}>
        API Key
        <input
          style={styles.input}
          value={settings.apiKey}
          onChange={(event) => updateField('apiKey', event.target.value)}
          type={showApiKey ? 'text' : 'password'}
          autoComplete="off"
        />
      </label>

      <label style={styles.checkboxLabel}>
        <input
          checked={showApiKey}
          onChange={(event) => setShowApiKey(event.target.checked)}
          type="checkbox"
        />
        Show API key
      </label>

      <div style={styles.buttonRow}>
        <button type="submit" style={styles.primaryButton}>Save Settings</button>
        <button type="button" style={styles.secondaryButton} onClick={onTestClick} disabled={testBusy}>
          {testBusy ? 'Testing...' : 'Test health / API / Ollama'}
        </button>
        <button type="button" style={styles.secondaryButton} onClick={props.onReset}>Reset to Web Part Defaults</button>
      </div>

      {testError ? <p style={styles.errorText}>Connection test failed: {testError}</p> : null}
      {testResult ? (
        <div style={styles.resultBox}>
          <div><strong>Health check:</strong> {testResult.healthOk ? 'Connected' : 'Unavailable'} ({testResult.healthUrl})</div>
          {typeof testResult.healthStatusCode === 'number' ? <div><strong>Health HTTP:</strong> {testResult.healthStatusCode}</div> : null}
          {testResult.healthDiagnosis ? <div><strong>Diagnosis:</strong> {testResult.healthDiagnosis}</div> : null}
          <div><strong>API:</strong> {testResult.apiOk ? 'Connected' : 'Unavailable'} ({testResult.apiUrl})</div>
          <div><strong>API node:</strong> {testResult.apiNodeVersion}</div>
          <div><strong>API time:</strong> {testResult.apiServerTime}</div>
          <div><strong>API default Ollama URL:</strong> {testResult.apiDefaultOllamaBaseUrl}</div>
          <div><strong>Ollama:</strong> {testResult.ollamaOk ? 'Connected' : 'Unavailable'} ({testResult.ollamaUrl})</div>
          {typeof testResult.ollamaStatusCode === 'number' ? <div><strong>Ollama HTTP:</strong> {testResult.ollamaStatusCode}</div> : null}
          {typeof testResult.ollamaModelCount === 'number' ? <div><strong>Model count:</strong> {testResult.ollamaModelCount}</div> : null}
          {testResult.ollamaMessage ? <div>Message: {testResult.ollamaMessage}</div> : null}
          {testResult.ollamaModels && testResult.ollamaModels.length > 0 ? (
            <div style={styles.modelList}>
              {testResult.ollamaModels.map((model) => (
                <div key={model.name || model.model} style={styles.modelCard}>
                  <div><strong>{model.name || model.model}</strong></div>
                  {model.model ? <div>Id: {model.model}</div> : null}
                  <div>Size: {formatBytes(model.size)}</div>
                  {model.modifiedAt ? <div>Updated: {model.modifiedAt}</div> : null}
                  {model.remoteHost ? <div>Remote: {model.remoteHost}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
          {typeof testResult.healthPayload !== 'undefined' ? (
            <pre style={styles.jsonBox}>{JSON.stringify(testResult.healthPayload, null, 2)}</pre>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    border: '1px solid #d0d7de',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: '#f8fafc'
  },
  heading: {
    margin: '0 0 8px 0'
  },
  description: {
    margin: '0 0 16px 0',
    color: '#475569'
  },
  defaultsBox: {
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #dbe4f0',
    color: '#334155',
    lineHeight: 1.6
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: 600
  },
  input: {
    display: 'block',
    width: '100%',
    marginTop: '6px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box'
  },
  checkboxLabel: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '16px'
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  resultBox: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#eef6ff',
    color: '#0f172a'
  },
  modelList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '10px',
    marginTop: '12px'
  },
  modelCard: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1'
  },
  jsonBox: {
    marginTop: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    overflowX: 'auto',
    fontSize: '12px'
  },
  errorText: {
    marginTop: '16px',
    color: '#b91c1c'
  },
  primaryButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #94a3b8',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    cursor: 'pointer'
  }
};

function formatBytes(value: number): string {
  if (!value) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
