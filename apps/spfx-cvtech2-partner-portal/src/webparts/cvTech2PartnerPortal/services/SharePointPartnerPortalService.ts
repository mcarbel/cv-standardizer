import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IPartnerCvListItem {
  Id: number;
  Title?: string;
  PartnerName?: string;
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

export interface IPartnerCvKeyItem {
  Id: number;
  CandidateId?: string;
  CvUrl?: {
    Url?: string;
    Description?: string;
  };
}

export interface IPartnerCvInput {
  title: string;
  partnerName?: string;
  candidateId: string;
  profileTitle: string;
  seniority: string;
  availability: string;
  skills: string[];
  summary: string;
  cvUrl: string;
  cvUrlDescription: string;
}

export interface ISharePointCvDocumentItem {
  Id: number;
  Title?: string;
  Modified?: string;
  File?: {
    Name?: string;
    ServerRelativeUrl?: string;
    LinkingUrl?: string;
  };
}

export interface IPartnerSearchLogItem {
  Id: number;
  Created?: string;
}

export interface IPartnerSearchLogInput {
  title: string;
  partnerAccountId?: number;
  partnerName: string;
  userEmail: string;
  query: string;
  skills: string[];
  resultsCount: number;
  quotaMaximum: number;
  searchesRemaining: number;
  monthKey: string;
  matchedCandidateIds?: string[];
  matchedCvUrls?: string[];
  matchedProfileTitles?: string[];
}

export interface IPartnerMissionItem {
  Id: number;
  Title?: string;
  PartnerAccountId?: number;
  Created?: string;
  PartnerName?: string;
  UserEmail?: string;
  MissionBrief?: string;
  MissionSkills?: string;
  Seniority?: string;
  Availability?: string;
  ResultsCount?: number;
  MatchedCandidateIds?: string;
}

export interface IPartnerMissionInput {
  title: string;
  partnerAccountId?: number;
  partnerName: string;
  userEmail: string;
  missionBrief: string;
  skills: string[];
  seniority: string;
  availability: string;
  resultsCount: number;
  matchedCandidateIds?: string[];
}

export interface IPartnerAccountItem {
  Id: number;
  Title?: string;
  PartnerName?: string;
  PartnerKey?: string;
  UserEmail?: string;
  MonthlySearchQuota?: number;
  IsActive?: boolean;
}

export class SharePointPartnerPortalService {
  public constructor(
    private readonly spHttpClient: SPHttpClient,
    private readonly siteUrl: string
  ) {}

  public async getAvailableCvs(listTitle: string, rowLimit: number, partnerName?: string): Promise<IPartnerCvListItem[]> {
    const normalizedPartnerName = (partnerName || '').trim().toLowerCase();
    const items = await this.getAvailableCvsWithOptionalPartnerField(listTitle, rowLimit);

    return items.filter((item: IPartnerCvListItem) => {
      if (item.IsAvailable === false) return false;
      const itemPartnerName = (item.PartnerName || '').trim().toLowerCase();
      return !normalizedPartnerName || !itemPartnerName || itemPartnerName === normalizedPartnerName;
    });
  }

  private async getAvailableCvsWithOptionalPartnerField(listTitle: string, rowLimit: number): Promise<IPartnerCvListItem[]> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(listTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,PartnerName,CandidateId,ProfileTitle,Seniority,Availability,Skills,Summary,IsAvailable,CvUrl';

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    if (!response.ok && response.status === 400) {
      return this.getAvailableCvsWithoutPartnerField(listTitle, rowLimit);
    }

    await this.ensureSuccess(response, `Unable to load CV list "${listTitle}"`);

    const payload = await response.json();
    return payload.value || [];
  }

  private async getAvailableCvsWithoutPartnerField(listTitle: string, rowLimit: number): Promise<IPartnerCvListItem[]> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(listTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,CandidateId,ProfileTitle,Seniority,Availability,Skills,Summary,IsAvailable,CvUrl';

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load CV list "${listTitle}"`);

    const payload = await response.json();
    return payload.value || [];
  }

  public async getPartnerAccount(accountListTitle: string, userEmail: string): Promise<IPartnerAccountItem | undefined> {
    const normalizedEmail = this.normalizeEmail(userEmail);
    if (!normalizedEmail) return undefined;

    const filter = `UserEmail eq '${this.escapeODataString(normalizedEmail)}'`;
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(accountListTitle)}')/items`
      + '?$top=10'
      + '&$select=Id,Title,PartnerName,PartnerKey,UserEmail,MonthlySearchQuota,IsActive'
      + `&$filter=${encodeURIComponent(filter)}`;

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load partner account list "${accountListTitle}"`);

    const payload = await response.json();
    return (payload.value || []).find((item: IPartnerAccountItem) => item.IsActive !== false);
  }

  public async getPartnerCvKeys(listTitle: string, rowLimit: number): Promise<IPartnerCvKeyItem[]> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(listTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,CandidateId,CvUrl';

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load CV keys from "${listTitle}"`);

    const payload = await response.json();
    return payload.value || [];
  }

  public async createPartnerCv(listTitle: string, input: IPartnerCvInput): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(listTitle)}')/items`;
    const body = {
      Title: input.title,
      PartnerName: input.partnerName || '',
      CandidateId: input.candidateId,
      ProfileTitle: input.profileTitle,
      Seniority: input.seniority,
      Availability: input.availability,
      Skills: input.skills.join(', '),
      Summary: input.summary,
      IsAvailable: true,
      CvUrl: {
        Url: input.cvUrl,
        Description: input.cvUrlDescription
      }
    };
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok && response.status === 400) {
      const legacyBody: Record<string, unknown> = { ...body };
      delete legacyBody.PartnerName;
      const legacyResponse = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(legacyBody)
      });
      await this.ensureSuccess(legacyResponse, `Unable to create PartnerCV item in "${listTitle}"`);
      return;
    }

    await this.ensureSuccess(response, `Unable to create PartnerCV item in "${listTitle}"`);
  }

  public async getCvDocuments(documentLibraryTitle: string, rowLimit: number): Promise<ISharePointCvDocumentItem[]> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(documentLibraryTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,Modified,File/Name,File/ServerRelativeUrl,File/LinkingUrl'
      + '&$expand=File'
      + '&$orderby=Modified desc';

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load CV documents from "${documentLibraryTitle}"`);

    const payload = await response.json();
    return (payload.value || []).filter((item: ISharePointCvDocumentItem) => {
      const fileName = item.File?.Name || '';
      return /\.(pdf|docx)$/i.test(fileName);
    });
  }

  public async isPartnerPortalAdmin(adminListTitle: string, userEmail: string): Promise<boolean> {
    const normalizedEmail = this.normalizeEmail(userEmail);
    if (!normalizedEmail) return false;

    const filter = `UserEmail eq '${this.escapeODataString(normalizedEmail)}'`;
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(adminListTitle)}')/items`
      + `?$top=5&$select=Id,UserEmail,IsActive&$filter=${encodeURIComponent(filter)}`;

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load Partner Portal admin list "${adminListTitle}"`);

    const payload = await response.json();
    return (payload.value || []).some((item: { IsActive?: boolean }) => item.IsActive !== false);
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
    const body = {
      Title: input.title,
      PartnerAccountId: input.partnerAccountId,
      PartnerName: input.partnerName,
      UserEmail: input.userEmail,
      SearchQuery: input.query,
      SearchSkills: input.skills.join(', '),
      ResultsCount: input.resultsCount,
      PartnerQuotaMaximum: input.quotaMaximum,
      SearchesRemaining: input.searchesRemaining,
      MonthKey: input.monthKey,
      MatchedCandidateIds: (input.matchedCandidateIds || []).join(', '),
      MatchedCvUrls: (input.matchedCvUrls || []).join('\n'),
      MatchedProfileTitles: (input.matchedProfileTitles || []).join('\n')
    };
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok && response.status === 400) {
      const legacyBody: Record<string, unknown> = { ...body };
      delete legacyBody.PartnerAccountId;
      delete legacyBody.MatchedCandidateIds;
      delete legacyBody.MatchedCvUrls;
      delete legacyBody.MatchedProfileTitles;
      const legacyResponse = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(legacyBody)
      });
      await this.ensureSuccess(legacyResponse, `Unable to write search audit item in "${auditListTitle}"`);
      return;
    }

    await this.ensureSuccess(response, `Unable to write search audit item in "${auditListTitle}"`);
  }

  public async getPartnerMissions(missionListTitle: string, partnerName: string, rowLimit: number): Promise<IPartnerMissionItem[]> {
    const filter = `PartnerName eq '${this.escapeODataString(partnerName)}'`;
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(missionListTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,Created,PartnerAccountId,PartnerName,UserEmail,MissionBrief,MissionSkills,Seniority,Availability,ResultsCount,MatchedCandidateIds'
      + '&$orderby=Created desc'
      + `&$filter=${encodeURIComponent(filter)}`;

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    if (!response.ok && response.status === 400) {
      return this.getPartnerMissionsWithoutAccountFields(missionListTitle, partnerName, rowLimit);
    }

    await this.ensureSuccess(response, `Unable to load partner mission list "${missionListTitle}"`);

    const payload = await response.json();
    return payload.value || [];
  }

  private async getPartnerMissionsWithoutAccountFields(missionListTitle: string, partnerName: string, rowLimit: number): Promise<IPartnerMissionItem[]> {
    const filter = `PartnerName eq '${this.escapeODataString(partnerName)}'`;
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(missionListTitle)}')/items`
      + `?$top=${rowLimit}`
      + '&$select=Id,Title,Created,PartnerName,UserEmail,MissionBrief,MissionSkills,Seniority,Availability,ResultsCount'
      + '&$orderby=Created desc'
      + `&$filter=${encodeURIComponent(filter)}`;

    const response = await this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    await this.ensureSuccess(response, `Unable to load partner mission list "${missionListTitle}"`);

    const payload = await response.json();
    return payload.value || [];
  }

  public async savePartnerMission(missionListTitle: string, input: IPartnerMissionInput): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(missionListTitle)}')/items`;
    const body = this.buildPartnerMissionBody(input);
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok && response.status === 400) {
      const legacyResponse = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(this.buildLegacyPartnerMissionBody(input))
      });
      await this.ensureSuccess(legacyResponse, `Unable to write partner mission item in "${missionListTitle}"`);
      return;
    }

    await this.ensureSuccess(response, `Unable to write partner mission item in "${missionListTitle}"`);
  }

  public async updatePartnerMission(missionListTitle: string, itemId: number, input: IPartnerMissionInput): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(missionListTitle)}')/items(${itemId})`;
    const body = this.buildPartnerMissionBody(input);
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'MERGE'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok && response.status === 400) {
      const legacyResponse = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE'
        },
        body: JSON.stringify(this.buildLegacyPartnerMissionBody(input))
      });
      await this.ensureSuccess(legacyResponse, `Unable to update partner mission item ${itemId} in "${missionListTitle}"`);
      return;
    }

    await this.ensureSuccess(response, `Unable to update partner mission item ${itemId} in "${missionListTitle}"`);
  }

  public async deletePartnerMission(missionListTitle: string, itemId: number): Promise<void> {
    const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.escapeODataString(missionListTitle)}')/items(${itemId})`;
    const response = await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'IF-MATCH': '*',
        'X-HTTP-Method': 'DELETE'
      }
    });

    await this.ensureSuccess(response, `Unable to delete partner mission item ${itemId} from "${missionListTitle}"`);
  }

  private async ensureSuccess(response: SPHttpClientResponse, message: string): Promise<void> {
    if (response.ok) return;

    const details = await response.text();
    throw new Error(`${message}. HTTP ${response.status}: ${details}`);
  }

  private buildPartnerMissionBody(input: IPartnerMissionInput): Record<string, string | number | undefined> {
    return {
      Title: input.title,
      PartnerAccountId: input.partnerAccountId,
      PartnerName: input.partnerName,
      UserEmail: input.userEmail,
      MissionBrief: input.missionBrief,
      MissionSkills: input.skills.join(', '),
      Seniority: input.seniority,
      Availability: input.availability,
      ResultsCount: input.resultsCount,
      MatchedCandidateIds: (input.matchedCandidateIds || []).join(', ')
    };
  }

  private buildLegacyPartnerMissionBody(input: IPartnerMissionInput): Record<string, string | number> {
    return {
      Title: input.title,
      PartnerName: input.partnerName,
      UserEmail: input.userEmail,
      MissionBrief: input.missionBrief,
      MissionSkills: input.skills.join(', '),
      Seniority: input.seniority,
      Availability: input.availability,
      ResultsCount: input.resultsCount
    };
  }

  private escapeODataString(value: string): string {
    return value.replace(/'/g, "''");
  }

  private normalizeEmail(value: string): string {
    return (value.split('|').pop() || value).trim().toLowerCase();
  }
}
