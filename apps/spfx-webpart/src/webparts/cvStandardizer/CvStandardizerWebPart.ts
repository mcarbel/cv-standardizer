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

export default class CvStandardizerWebPart extends BaseClientSideWebPart<ICvStandardizerWebPartProps> {
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
