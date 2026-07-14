import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IPartnerCvListItem {
  Id: number;
  Title?: string;
  CandidateId?: string;
  ProfileTitle?: string;
  Seniority?: string;
  Availability?: string;
  Skills?: string;
  Summary?: string;
  IsAvailable?: boolean;
  CvUrl?: {
    Url?: string;
    Description?: string;
  };
}

export interface IPartnerSearchLogItem {
  Id: number;
  Created?: string;
}

export interface IPartnerSearchLogInput {
  title: string;
  partnerName: string;
  userEmail: string;
  query: string;
  skills: string[];
  resultsCount: number;
  quotaMaximum: number;
  searchesRemaining: number;
  monthKey: string;
}

export class SharePointPartnerPortalService {
  public constructor(
    private readonly spHttpClient: SPHttpClient,
    private readonly siteUrl: string
  ) {}

  public async getAvailableCvs(listTitle: string, rowLimit: number): Promise<IPartnerCvListItem[]> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(listTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,CandidateId,ProfileTitle,Seniority,Availability,Skills,Summary,IsAvailable,CvUrl';

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load CV list "${listTitle}"`);

    const payload = await response.json();
    return (payload.value || []).filter((item: IPartnerCvListItem) => item.IsAvailable !== false);
  }

  public async countMonthlySearches(
    auditListTitle: string,
    partnerName: string,
    userEmail: string,
    monthKey: string
  ): Promise<number> {
    const filter = [
      `PartnerName eq '${this.escapeODataString(partnerName)}'`,
      `UserEmail eq '${this.escapeODataString(userEmail)}'`,
      `MonthKey eq '${this.escapeODataString(monthKey)}'`
    ].join(' and ');
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(auditListTitle)}')/items`
      + `?$top=5000&$select=Id&$filter=${encodeURIComponent(filter)}`;

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load search audit list "${auditListTitle}"`);

    const payload = await response.json();
    return (payload.value || []).length;
  }

  public async logSearch(auditListTitle: string, input: IPartnerSearchLogInput): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(auditListTitle)}')/items`;
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata'
      },
      body: JSON.stringify({
        Title: input.title,
        PartnerName: input.partnerName,
        UserEmail: input.userEmail,
        SearchQuery: input.query,
        SearchSkills: input.skills.join(', '),
        ResultsCount: input.resultsCount,
        PartnerQuotaMaximum: input.quotaMaximum,
        SearchesRemaining: input.searchesRemaining,
        MonthKey: input.monthKey
      })
    });

    await this.ensureSuccess(response, `Unable to write search audit item in "${auditListTitle}"`);
  }

  private async ensureSuccess(response: SPHttpClientResponse, message: string): Promise<void> {
    if (response.ok) return;

    const details = await response.text();
    throw new Error(`${message}. HTTP ${response.status}: ${details}`);
  }

  private escapeODataString(value: string): string {
    return value.replace(/'/g, "''");
  }
}
