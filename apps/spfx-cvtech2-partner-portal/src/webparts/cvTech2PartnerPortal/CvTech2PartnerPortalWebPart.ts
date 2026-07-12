import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import CvTech2PartnerPortal from './components/CvTech2PartnerPortal';

export interface ICvTech2PartnerPortalWebPartProps {
  brandLabel: string;
  portalTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentTextColor: string;
  surfaceColor: string;
}

const DEFAULT_PROPS: ICvTech2PartnerPortalWebPartProps = {
  brandLabel: 'cvtech2',
  portalTitle: 'Partner Portal',
  primaryColor: '#27c2c6',
  secondaryColor: '#136d70',
  accentTextColor: '#16323a',
  surfaceColor: '#eef4f8'
};

export default class CvTech2PartnerPortalWebPart extends BaseClientSideWebPart<ICvTech2PartnerPortalWebPartProps> {
  protected async onInit(): Promise<void> {
    this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
    this.properties.portalTitle = this.properties.portalTitle || DEFAULT_PROPS.portalTitle;
    this.properties.primaryColor = this.properties.primaryColor || DEFAULT_PROPS.primaryColor;
    this.properties.secondaryColor = this.properties.secondaryColor || DEFAULT_PROPS.secondaryColor;
    this.properties.accentTextColor = this.properties.accentTextColor || DEFAULT_PROPS.accentTextColor;
    this.properties.surfaceColor = this.properties.surfaceColor || DEFAULT_PROPS.surfaceColor;

    await super.onInit();
  }

  public render(): void {
    const element = React.createElement(CvTech2PartnerPortal, {
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
          header: { description: 'CVTech2 Partner Portal configuration' },
          groups: [
            {
              groupName: 'Content',
              groupFields: [
                PropertyPaneTextField('brandLabel', { label: 'Brand label' }),
                PropertyPaneTextField('portalTitle', { label: 'Portal title' })
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
