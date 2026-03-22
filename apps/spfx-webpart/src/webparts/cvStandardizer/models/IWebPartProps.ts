export interface ICvStandardizerWebPartProps {
  apiBaseUrl: string;
  defaultProvider: 'heuristic' | 'openai' | 'ollama';
  defaultModel: string;
  providerBaseUrl: string;
  apiKey: string;
  outputFormat: 'docx' | 'pdf' | 'markdown';
  dumpJson: boolean;
  enableDebugPanel: boolean;
  useLocalApiProxy: boolean;
  allowUserOverrideProvider: boolean;
  allowUserOverrideModel: boolean;
}
