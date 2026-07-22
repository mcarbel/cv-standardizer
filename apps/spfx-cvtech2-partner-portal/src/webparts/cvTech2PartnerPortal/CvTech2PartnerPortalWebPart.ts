import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import { PropertyPaneDropdown, PropertyPaneSlider, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { SPHttpClient } from '@microsoft/sp-http';
import CvTech2PartnerPortal from './components/CvTech2PartnerPortal';

export type PartnerPortalTemplate = 'cockpit-saas' | 'executive-partner' | 'marketplace-talent' | 'mission-match-studio';

export interface ICvTech2PartnerPortalWebPartProps {
  portalTemplate: PartnerPortalTemplate;
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
  dataSiteUrl: string;
  cvListTitle: string;
  auditListTitle: string;
  missionListTitle: string;
  adminListTitle: string;
  cvDocumentLibraryTitle: string;
  partnerName: string;
  partnerMonthlyQuota: number;
  cvRowLimit: number;
  overviewPosition: number;
  cvLibraryPosition: number;
  missionMatchPosition: number;
  plansPosition: number;
  compliancePosition: number;
}

const DEFAULT_PROPS: ICvTech2PartnerPortalWebPartProps = {
  portalTemplate: 'cockpit-saas',
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
  dataSiteUrl: 'https://braineesysms365.sharepoint.com/sites/CVTech2',
  cvListTitle: 'PartnerCVs',
  auditListTitle: 'PartnerSearchLogs',
  missionListTitle: 'PartnerMissions',
  adminListTitle: 'PartnerPortalAdmins',
  cvDocumentLibraryTitle: 'Documents',
  partnerName: 'Default Partner',
  partnerMonthlyQuota: 100,
  cvRowLimit: 500,
  overviewPosition: 1,
  missionMatchPosition: 2,
  cvLibraryPosition: 3,
  plansPosition: 4,
  compliancePosition: 5
};

export default class CvTech2PartnerPortalWebPart extends BaseClientSideWebPart<ICvTech2PartnerPortalWebPartProps> {
  protected async onInit(): Promise<void> {
    this.properties.brandLabel = this.properties.brandLabel || DEFAULT_PROPS.brandLabel;
    this.properties.portalTemplate = this.properties.portalTemplate || DEFAULT_PROPS.portalTemplate;
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
    this.properties.dataSiteUrl = this.properties.dataSiteUrl || DEFAULT_PROPS.dataSiteUrl;
    this.properties.cvListTitle = this.properties.cvListTitle || DEFAULT_PROPS.cvListTitle;
    this.properties.auditListTitle = this.properties.auditListTitle || DEFAULT_PROPS.auditListTitle;
    this.properties.missionListTitle = this.properties.missionListTitle || DEFAULT_PROPS.missionListTitle;
    this.properties.adminListTitle = this.properties.adminListTitle || DEFAULT_PROPS.adminListTitle;
    this.properties.cvDocumentLibraryTitle = this.properties.cvDocumentLibraryTitle || DEFAULT_PROPS.cvDocumentLibraryTitle;
    this.properties.partnerName = this.properties.partnerName || DEFAULT_PROPS.partnerName;
    this.properties.partnerMonthlyQuota = this.properties.partnerMonthlyQuota || DEFAULT_PROPS.partnerMonthlyQuota;
    this.properties.cvRowLimit = this.properties.cvRowLimit || DEFAULT_PROPS.cvRowLimit;
    this.properties.overviewPosition = this.properties.overviewPosition || DEFAULT_PROPS.overviewPosition;
    this.properties.missionMatchPosition = this.properties.missionMatchPosition || DEFAULT_PROPS.missionMatchPosition;
    this.properties.cvLibraryPosition = this.properties.cvLibraryPosition || DEFAULT_PROPS.cvLibraryPosition;
    this.properties.plansPosition = this.properties.plansPosition || DEFAULT_PROPS.plansPosition;
    this.properties.compliancePosition = this.properties.compliancePosition || DEFAULT_PROPS.compliancePosition;

    await super.onInit();
  }

  public render(): void {
    const element = React.createElement(CvTech2PartnerPortal, {
      webPartProps: this.properties,
      spHttpClient: this.context.spHttpClient as SPHttpClient,
      siteUrl: this.properties.dataSiteUrl || this.context.pageContext.web.absoluteUrl,
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
                PropertyPaneDropdown('portalTemplate', {
                  label: 'Portal template',
                  options: [
                    { key: 'cockpit-saas', text: 'Cockpit SaaS' },
                    { key: 'executive-partner', text: 'Executive Partner' },
                    { key: 'marketplace-talent', text: 'Marketplace Talent' },
                    { key: 'mission-match-studio', text: 'Mission Match Studio' }
                  ]
                }),
                PropertyPaneTextField('brandLabel', { label: 'Brand label' }),
                PropertyPaneTextField('portalTitle', { label: 'Portal title' })
              ]
            },
            {
              groupName: 'SharePoint data',
              groupFields: [
                PropertyPaneTextField('dataSiteUrl', { label: 'Data site URL' }),
                PropertyPaneTextField('cvListTitle', { label: 'CV list title' }),
                PropertyPaneTextField('auditListTitle', { label: 'Search audit list title' }),
                PropertyPaneTextField('missionListTitle', { label: 'Partner mission list title' }),
                PropertyPaneTextField('adminListTitle', { label: 'Portal admin list title' }),
                PropertyPaneTextField('cvDocumentLibraryTitle', { label: 'CV document library title' }),
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
              groupName: 'Section order',
              groupFields: [
                PropertyPaneSlider('overviewPosition', { label: 'Overview position', min: 1, max: 10, step: 1 }),
                PropertyPaneSlider('missionMatchPosition', { label: 'Mission Match position', min: 1, max: 10, step: 1 }),
                PropertyPaneSlider('cvLibraryPosition', { label: 'CV Library position', min: 1, max: 10, step: 1 }),
                PropertyPaneSlider('plansPosition', { label: 'Plans position', min: 1, max: 10, step: 1 }),
                PropertyPaneSlider('compliancePosition', { label: 'Compliance position', min: 1, max: 10, step: 1 })
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
