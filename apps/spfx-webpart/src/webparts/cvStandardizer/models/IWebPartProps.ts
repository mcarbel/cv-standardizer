export interface ICvStandardizerWebPartProps {
  apiBaseUrl: string;
  defaultProvider: 'heuristic' | 'openai' | 'ollama';
  defaultModel: string;
  providerBaseUrl: string;
  apiKey: string;
  outputFormat: 'docx' | 'pdf' | 'markdown';
  templateStyle: 'standard' | 'modern' | 'consulting';
  anonymizeCandidateName: boolean;
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  sectionColor: string;
  dumpJson: boolean;
  enableDebugPanel: boolean;
  useLocalApiProxy: boolean;
  allowUserOverrideProvider: boolean;
  allowUserOverrideModel: boolean;
}
