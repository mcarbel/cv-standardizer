import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import {
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import CvStandardizerApp from './components/CvStandardizerApp';
import type { ICvStandardizerWebPartProps } from './models/IWebPartProps';

const DEFAULT_WEBPART_PROPS: ICvStandardizerWebPartProps = {
  apiBaseUrl: 'https://localhost:8787',
  defaultProvider: 'ollama',
  defaultModel: 'kimi-k2.5:cloud',
  providerBaseUrl: 'http://localhost:11434',
  apiKey: '',
  outputFormat: 'docx',
  outputLanguage: 'en',
  templateStyle: 'consulting',
  anonymizeCandidateName: false,
  titleColor: '#0F172A',
  subtitleColor: '#475569',
  bodyColor: '#334155',
  sectionColor: '#0F766E',
  dumpJson: true,
  enableDebugPanel: true,
  useLocalApiProxy: false,
  allowUserOverrideProvider: false,
  allowUserOverrideModel: false
};

export default class CvStandardizerWebPart extends BaseClientSideWebPart<ICvStandardizerWebPartProps> {
  protected async onInit(): Promise<void> {
    this.properties.apiBaseUrl = this.properties.apiBaseUrl || DEFAULT_WEBPART_PROPS.apiBaseUrl;
    this.properties.defaultProvider = this.properties.defaultProvider || DEFAULT_WEBPART_PROPS.defaultProvider;
    this.properties.defaultModel = this.properties.defaultModel || DEFAULT_WEBPART_PROPS.defaultModel;
    this.properties.providerBaseUrl = this.properties.providerBaseUrl || DEFAULT_WEBPART_PROPS.providerBaseUrl;
    this.properties.apiKey = this.properties.apiKey || DEFAULT_WEBPART_PROPS.apiKey;
    this.properties.outputFormat = this.properties.outputFormat || DEFAULT_WEBPART_PROPS.outputFormat;
    this.properties.outputLanguage = this.properties.outputLanguage || DEFAULT_WEBPART_PROPS.outputLanguage;
    this.properties.templateStyle = this.properties.templateStyle || DEFAULT_WEBPART_PROPS.templateStyle;
    this.properties.anonymizeCandidateName = this.properties.anonymizeCandidateName ?? DEFAULT_WEBPART_PROPS.anonymizeCandidateName;
    this.properties.titleColor = this.properties.titleColor || DEFAULT_WEBPART_PROPS.titleColor;
    this.properties.subtitleColor = this.properties.subtitleColor || DEFAULT_WEBPART_PROPS.subtitleColor;
    this.properties.bodyColor = this.properties.bodyColor || DEFAULT_WEBPART_PROPS.bodyColor;
    this.properties.sectionColor = this.properties.sectionColor || DEFAULT_WEBPART_PROPS.sectionColor;
    this.properties.dumpJson = this.properties.dumpJson ?? DEFAULT_WEBPART_PROPS.dumpJson;
    this.properties.enableDebugPanel = this.properties.enableDebugPanel ?? DEFAULT_WEBPART_PROPS.enableDebugPanel;
    this.properties.useLocalApiProxy = this.properties.useLocalApiProxy ?? DEFAULT_WEBPART_PROPS.useLocalApiProxy;
    this.properties.allowUserOverrideProvider = this.properties.allowUserOverrideProvider ?? DEFAULT_WEBPART_PROPS.allowUserOverrideProvider;
    this.properties.allowUserOverrideModel = this.properties.allowUserOverrideModel ?? DEFAULT_WEBPART_PROPS.allowUserOverrideModel;

    await super.onInit();
  }

  public render(): void {
    const element = React.createElement(CvStandardizerApp, {
      webPartProps: this.properties
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'CV Standardizer configuration' },
          groups: [
            {
              groupName: 'API',
              groupFields: [
                PropertyPaneTextField('apiBaseUrl', { label: 'API Base URL' }),
                PropertyPaneDropdown('defaultProvider', {
                  label: 'Default provider',
                  options: [
                    { key: 'heuristic', text: 'Heuristic' },
                    { key: 'openai', text: 'OpenAI' },
                    { key: 'ollama', text: 'Ollama' }
                  ]
                }),
                PropertyPaneTextField('defaultModel', { label: 'Default model' }),
                PropertyPaneTextField('providerBaseUrl', { label: 'Provider Base URL' }),
                PropertyPaneTextField('apiKey', { label: 'API Key' })
              ]
            },
            {
              groupName: 'Output',
              groupFields: [
                PropertyPaneDropdown('outputFormat', {
                  label: 'Output format',
                  options: [
                    { key: 'docx', text: 'DOCX' },
                    { key: 'pdf', text: 'PDF' },
                    { key: 'markdown', text: 'Markdown' }
                  ]
                }),
                PropertyPaneDropdown('outputLanguage', {
                  label: 'Output language',
                  options: [
                    { key: 'en', text: 'English' },
                    { key: 'fr', text: 'French' }
                  ]
                }),
                PropertyPaneDropdown('templateStyle', {
                  label: 'Template style',
                  options: [
                    { key: 'standard', text: 'Standard' },
                    { key: 'modern', text: 'Modern' },
                    { key: 'consulting', text: 'Consulting' }
                  ]
                }),
                PropertyPaneToggle('anonymizeCandidateName', { label: 'Anonymize candidate name' }),
                PropertyPaneTextField('titleColor', { label: 'Title color' }),
                PropertyPaneTextField('subtitleColor', { label: 'Subtitle color' }),
                PropertyPaneTextField('bodyColor', { label: 'Body text color' }),
                PropertyPaneTextField('sectionColor', { label: 'Section color' }),
                PropertyPaneToggle('dumpJson', { label: 'Enable JSON download' }),
                PropertyPaneToggle('enableDebugPanel', { label: 'Enable debug panel' }),
                PropertyPaneToggle('useLocalApiProxy', { label: 'Use local SPFx proxy (localhost:4321)' }),
                PropertyPaneToggle('allowUserOverrideProvider', { label: 'Allow provider override' }),
                PropertyPaneToggle('allowUserOverrideModel', { label: 'Allow model override' })
              ]
            }
          ]
        }
      ]
    };
  }
}
