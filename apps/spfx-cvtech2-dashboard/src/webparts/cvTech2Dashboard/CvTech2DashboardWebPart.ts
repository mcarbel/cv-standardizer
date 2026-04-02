import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import {
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import CvTech2Dashboard from './components/CvTech2Dashboard';

export interface ICvTech2DashboardWebPartProps {
  brandLabel: string;
  greetingName: string;
  profileInitials: string;
  overviewLabel: string;
  languagePrimary: string;
  languageSecondary: string;
  primaryColor: string;
  secondaryColor: string;
  accentTextColor: string;
  surfaceColor: string;
}

const DEFAULT_PROPS: ICvTech2DashboardWebPartProps = {
  brandLabel: 'cvtech2',
  greetingName: 'Mario',
  profileInitials: 'MC',
  overviewLabel: '3 months overview',
  languagePrimary: 'English',
  languageSecondary: 'Francais',
  primaryColor: '#27c2c6',
  secondaryColor: '#136d70',
  accentTextColor: '#16323a',
  surfaceColor: '#f3f7fb'
};

export default class CvTech2DashboardWebPart extends BaseClientSideWebPart<ICvTech2DashboardWebPartProps> {
  protected async onInit(): Promise<void> {
    this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
    this.properties.greetingName = this.properties.greetingName || DEFAULT_PROPS.greetingName;
    this.properties.profileInitials = this.properties.profileInitials || DEFAULT_PROPS.profileInitials;
    this.properties.overviewLabel = this.properties.overviewLabel || DEFAULT_PROPS.overviewLabel;
    this.properties.languagePrimary = this.properties.languagePrimary || DEFAULT_PROPS.languagePrimary;
    this.properties.languageSecondary = this.properties.languageSecondary || DEFAULT_PROPS.languageSecondary;
    this.properties.primaryColor = this.properties.primaryColor || DEFAULT_PROPS.primaryColor;
    this.properties.secondaryColor = this.properties.secondaryColor || DEFAULT_PROPS.secondaryColor;
    this.properties.accentTextColor = this.properties.accentTextColor || DEFAULT_PROPS.accentTextColor;
    this.properties.surfaceColor = this.properties.surfaceColor || DEFAULT_PROPS.surfaceColor;

    await super.onInit();
  }

  public render(): void {
    const element = React.createElement(CvTech2Dashboard, {
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
          header: { description: 'CVTech2 Dashboard configuration' },
          groups: [
            {
              groupName: 'Content',
              groupFields: [
                PropertyPaneTextField('brandLabel', { label: 'Brand label' }),
                PropertyPaneTextField('greetingName', { label: 'Greeting name' }),
                PropertyPaneTextField('profileInitials', { label: 'Profile initials' }),
                PropertyPaneTextField('overviewLabel', { label: 'Overview label' }),
                PropertyPaneTextField('languagePrimary', { label: 'Primary language label' }),
                PropertyPaneTextField('languageSecondary', { label: 'Secondary language label' })
              ]
            },
            {
              groupName: 'Theme',
              groupFields: [
                PropertyPaneTextField('primaryColor', { label: 'Primary color' }),
                PropertyPaneTextField('secondaryColor', { label: 'Secondary color' }),
                PropertyPaneTextField('accentTextColor', { label: 'Accent text color' }),
                PropertyPaneTextField('surfaceColor', { label: 'Surface color' })
              ]
            }
          ]
        }
      ]
    };
  }
}
