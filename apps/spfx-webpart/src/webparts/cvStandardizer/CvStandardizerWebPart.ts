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
                PropertyPaneToggle('dumpJson', { label: 'Enable JSON download' }),
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
