import * as React from 'react';

export interface AdminSettings {
  apiBaseUrl: string;
  providerBaseUrl: string;
  defaultModel: string;
  apiKey: string;
}

interface AdminPanelProps {
  initialSettings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
  onReset: () => void;
  onTestConnections: (settings: AdminSettings) => Promise<ConnectionTestState>;
}

export interface ConnectionTestState {
  apiOk: boolean;
  ollamaOk: boolean;
  apiUrl: string;
  ollamaUrl: string;
  ollamaMessage?: string;
  ollamaModels?: string[];
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

  function updateField(field: keyof AdminSettings, value: string): void {
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
          {testBusy ? 'Testing...' : 'Test API / Ollama'}
        </button>
        <button type="button" style={styles.secondaryButton} onClick={props.onReset}>Reset to Web Part Defaults</button>
      </div>

      {testError ? <p style={styles.errorText}>Connection test failed: {testError}</p> : null}
      {testResult ? (
        <div style={styles.resultBox}>
          <div>API: {testResult.apiOk ? 'Connected' : 'Unavailable'} ({testResult.apiUrl})</div>
          <div>Ollama: {testResult.ollamaOk ? 'Connected' : 'Unavailable'} ({testResult.ollamaUrl})</div>
          {testResult.ollamaMessage ? <div>Message: {testResult.ollamaMessage}</div> : null}
          {testResult.ollamaModels && testResult.ollamaModels.length > 0 ? (
            <div>Models: {testResult.ollamaModels.join(', ')}</div>
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
