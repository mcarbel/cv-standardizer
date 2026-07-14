import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import { PropertyPaneSlider, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { SPHttpClient } from '@microsoft/sp-http';
import CvTech2PartnerPortal from './components/CvTech2PartnerPortal';

export interface ICvTech2PartnerPortalWebPartProps {
  brandLabel: string;
  portalTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentTextColor: string;
  surfaceColor: string;
  webPartMaxWidth: number;
  sidebarWidth: number;
  minHeight: number;
  contentPadding: number;
  sectionGap: number;
  cardPadding: number;
  borderRadius: number;
  metricMinWidth: number;
  metricMinHeight: number;
  titleFontSize: number;
  bodyFontSize: number;
  cvListTitle: string;
  auditListTitle: string;
  partnerName: string;
  partnerMonthlyQuota: number;
  cvRowLimit: number;
}

const DEFAULT_PROPS: ICvTech2PartnerPortalWebPartProps = {
  brandLabel: 'cvtech2',
  portalTitle: 'Partner Portal',
  primaryColor: '#27c2c6',
  secondaryColor: '#136d70',
  accentTextColor: '#16323a',
  surfaceColor: '#eef4f8',
  webPartMaxWidth: 1440,
  sidebarWidth: 280,
  minHeight: 760,
  contentPadding: 28,
  sectionGap: 22,
  cardPadding: 22,
  borderRadius: 10,
  metricMinWidth: 180,
  metricMinHeight: 132,
  titleFontSize: 48,
  bodyFontSize: 17,
  cvListTitle: 'PartnerCVs',
  auditListTitle: 'PartnerSearchLogs',
  partnerName: 'Default Partner',
  partnerMonthlyQuota: 100,
  cvRowLimit: 500
};

export default class CvTech2PartnerPortalWebPart extends BaseClientSideWebPart<ICvTech2PartnerPortalWebPartProps> {
  protected async onInit(): Promise<void> {
    this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
    this.properties.portalTitle = this.properties.portalTitle || DEFAULT_PROPS.portalTitle;
    this.properties.primaryColor = this.properties.primaryColor || DEFAULT_PROPS.primaryColor;
    this.properties.secondaryColor = this.properties.secondaryColor || DEFAULT_PROPS.secondaryColor;
    this.properties.accentTextColor = this.properties.accentTextColor || DEFAULT_PROPS.accentTextColor;
    this.properties.surfaceColor = this.properties.surfaceColor || DEFAULT_PROPS.surfaceColor;
    this.properties.webPartMaxWidth = this.properties.webPartMaxWidth || DEFAULT_PROPS.webPartMaxWidth;
    this.properties.sidebarWidth = this.properties.sidebarWidth || DEFAULT_PROPS.sidebarWidth;
    this.properties.minHeight = this.properties.minHeight || DEFAULT_PROPS.minHeight;
    this.properties.contentPadding = this.properties.contentPadding || DEFAULT_PROPS.contentPadding;
    this.properties.sectionGap = this.properties.sectionGap || DEFAULT_PROPS.sectionGap;
    this.properties.cardPadding = this.properties.cardPadding || DEFAULT_PROPS.cardPadding;
    this.properties.borderRadius = this.properties.borderRadius || DEFAULT_PROPS.borderRadius;
    this.properties.metricMinWidth = this.properties.metricMinWidth || DEFAULT_PROPS.metricMinWidth;
    this.properties.metricMinHeight = this.properties.metricMinHeight || DEFAULT_PROPS.metricMinHeight;
    this.properties.titleFontSize = this.properties.titleFontSize || DEFAULT_PROPS.titleFontSize;
    this.properties.bodyFontSize = this.properties.bodyFontSize || DEFAULT_PROPS.bodyFontSize;
    this.properties.cvListTitle = this.properties.cvListTitle || DEFAULT_PROPS.cvListTitle;
    this.properties.auditListTitle = this.properties.auditListTitle || DEFAULT_PROPS.auditListTitle;
    this.properties.partnerName = this.properties.partnerName || DEFAULT_PROPS.partnerName;
    this.properties.partnerMonthlyQuota = this.properties.partnerMonthlyQuota || DEFAULT_PROPS.partnerMonthlyQuota;
    this.properties.cvRowLimit = this.properties.cvRowLimit || DEFAULT_PROPS.cvRowLimit;

    await super.onInit();
  }

  public render(): void {
    const element = React.createElement(CvTech2PartnerPortal, {
      webPartProps: this.properties,
      spHttpClient: this.context.spHttpClient as SPHttpClient,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      userDisplayName: this.context.pageContext.user.displayName,
      userEmail: this.context.pageContext.user.email || this.context.pageContext.user.loginName
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
              groupName: 'SharePoint data',
              groupFields: [
                PropertyPaneTextField('cvListTitle', { label: 'CV list title' }),
                PropertyPaneTextField('auditListTitle', { label: 'Search audit list title' }),
                PropertyPaneTextField('partnerName', { label: 'Partner name' }),
                PropertyPaneSlider('partnerMonthlyQuota', { label: 'Monthly search quota', min: 1, max: 1000, step: 1 }),
                PropertyPaneSlider('cvRowLimit', { label: 'Maximum CV rows to load', min: 20, max: 5000, step: 20 })
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
            },
            {
              groupName: 'Responsive layout',
              groupFields: [
                PropertyPaneSlider('webPartMaxWidth', { label: 'Web part max width (px)', min: 720, max: 1920, step: 20 }),
                PropertyPaneSlider('sidebarWidth', { label: 'Sidebar width (px)', min: 180, max: 420, step: 10 }),
                PropertyPaneSlider('minHeight', { label: 'Minimum height (px)', min: 420, max: 1200, step: 20 }),
                PropertyPaneSlider('contentPadding', { label: 'Content padding (px)', min: 8, max: 56, step: 2 }),
                PropertyPaneSlider('sectionGap', { label: 'Section gap (px)', min: 8, max: 48, step: 2 }),
                PropertyPaneSlider('cardPadding', { label: 'Card padding (px)', min: 10, max: 40, step: 2 }),
                PropertyPaneSlider('borderRadius', { label: 'Border radius (px)', min: 0, max: 32, step: 1 }),
                PropertyPaneSlider('metricMinWidth', { label: 'Metric card min width (px)', min: 120, max: 320, step: 10 }),
                PropertyPaneSlider('metricMinHeight', { label: 'Metric card min height (px)', min: 80, max: 220, step: 10 }),
                PropertyPaneSlider('titleFontSize', { label: 'Title font size (px)', min: 28, max: 72, step: 2 }),
                PropertyPaneSlider('bodyFontSize', { label: 'Body font size (px)', min: 13, max: 22, step: 1 })
              ]
            }
          ]
        }
      ]
    };
  }
}
