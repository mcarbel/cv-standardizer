import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SPHttpClient } from '@microsoft/sp-http';
import type { ICvTech2PartnerPortalWebPartProps, PartnerPortalTemplate } from '../CvTech2PartnerPortalWebPart';
import {
  IPartnerCvInput,
  IPartnerCvListItem,
  IPartnerMissionItem,
  ISharePointCvDocumentItem,
  SharePointPartnerPortalService
} from '../services/SharePointPartnerPortalService';

interface Props {
  webPartProps: ICvTech2PartnerPortalWebPartProps;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  userDisplayName: string;
  userEmail: string;
}

interface CandidateProfile {
  id: string;
  title: string;
  meta: string;
  seniority: string;
  availability: string;
  skills: string[];
  summary: string;
  cvUrl?: string;
  score?: number;
}

const suggestedSkills = [
  'Azure',
  'GCP',
  'AWS',
  'Terraform',
  'IAM',
  'Kubernetes',
  'Cybersecurity',
  'Compliance',
  'DevSecOps',
  'Landing Zone'
];

const plans = [
  {
    name: 'Starter',
    price: 'EUR 490',
    detail: 'Low-volume partner sourcing.',
    features: ['50 searches / month', '3 reveal requests', 'Email support']
  },
  {
    name: 'Partner Pro',
    price: 'EUR 1,290',
    detail: 'Recurring mission pipelines.',
    features: ['Unlimited anonymized searches', '15 reveal requests', 'Saved mission briefs'],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'Governed access at scale.',
    features: ['SSO / Entra ID', 'Approval workflow', 'Audit retention']
  }
];

type SectionId = 'overview' | 'cv-library' | 'mission-match' | 'plans' | 'compliance' | 'administration';

const navItems: Array<{ id: SectionId; label: string; defaultOrder: number }> = [
  { id: 'overview', label: 'Overview', defaultOrder: 1 },
  { id: 'mission-match', label: 'Mission Match', defaultOrder: 2 },
  { id: 'cv-library', label: 'CV Library', defaultOrder: 3 },
  { id: 'plans', label: 'Plans', defaultOrder: 4 },
  { id: 'compliance', label: 'Compliance', defaultOrder: 5 },
  { id: 'administration', label: 'Administration', defaultOrder: 99 }
];

const skillSynonyms = [
  'Azure',
  'GCP',
  'AWS',
  'Terraform',
  'IAM',
  'Kubernetes',
  'Cybersecurity',
  'Compliance',
  'DevSecOps',
  'Landing Zone',
  'Cloud Security',
  'Zero Trust',
  'Network',
  'SOC',
  'SIEM',
  'M365',
  'SharePoint',
  'Power Platform',
  'Java',
  'React',
  'Node',
  'Python',
  'Data',
  'AI',
  'PMO',
  'Agile'
];

function scoreProfile(profile: CandidateProfile, selectedSkills: string[]): number {
  const matches = selectedSkills.filter((skill) =>
    profile.skills.some((profileSkill) => profileSkill.toLowerCase() === skill.toLowerCase())
  ).length;

  return Math.min(99, 62 + matches * 9);
}

type LayoutMode = 'desktop' | 'tablet' | 'mobile';

interface TemplateTokens {
  navigation: 'side' | 'top';
  shellBackground: string;
  sidebarBackground: string;
  sidebarTextColor: string;
  sidebarMutedColor: string;
  sidebarRadius: number | string;
  sidebarShadow: string;
  navTextColor: string;
  navActiveBackground: string;
  navActiveTextColor: string;
  sidePanelBackground: string;
  cardBackground: string;
  panelBackground: string;
  cardBorder: string;
  cardShadow: string;
  mutedTextColor: string;
  fontFamily: string;
  heroColumns: (metricMinWidth: number, sectionGap: number) => string;
  cardRadius: (borderRadius: number) => number;
}

function mapSharePointCv(item: IPartnerCvListItem): CandidateProfile {
  return {
    id: item.CandidateId || `CV-${item.Id}`,
    title: item.ProfileTitle || item.Title || 'Anonymized candidate',
    meta: [
      item.Seniority || 'Unspecified seniority',
      item.Availability || 'Availability to confirm'
    ].join(' | '),
    seniority: item.Seniority || '',
    availability: item.Availability || '',
    skills: splitSkills(item.Skills || ''),
    summary: item.Summary || 'No summary available yet.',
    cvUrl: item.CvUrl?.Url
  };
}

function splitSkills(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getMonthKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

function formatMissionDate(value?: string): string {
  if (!value) return 'Date unavailable';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function cleanProfileTitle(value: string): string {
  const withoutExtension = value.replace(/\.(pdf|docx)$/i, '');
  return withoutExtension
    .replace(/[_-]+/g, ' ')
    .replace(/\b(cv|resume|anonymous|anonymized|standardise|standardized|v\d+(\.\d+)*)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Anonymized consultant';
}

function inferSkillsFromText(value: string): string[] {
  const lower = value.toLowerCase();
  const skills = skillSynonyms.filter((skill) => lower.includes(skill.toLowerCase()));
  return Array.from(new Set(skills.length ? skills : ['General IT Consulting']));
}

function inferSeniority(value: string): string {
  const lower = value.toLowerCase();
  if (/\b(architect|principal)\b/.test(lower)) return 'Architect';
  if (/\b(lead|manager|head)\b/.test(lower)) return 'Lead';
  if (/\b(senior|sr)\b/.test(lower)) return 'Senior';
  if (/\b(junior|jr)\b/.test(lower)) return 'Junior';
  return 'Senior';
}

function buildAbsoluteSharePointUrl(siteUrl: string, document: ISharePointCvDocumentItem): string {
  if (document.File?.LinkingUrl) return document.File.LinkingUrl;
  const serverRelativeUrl = document.File?.ServerRelativeUrl || '';
  if (!serverRelativeUrl) return siteUrl;
  return `${new URL(siteUrl).origin}${serverRelativeUrl}`;
}

function mapDocumentToPartnerCv(siteUrl: string, document: ISharePointCvDocumentItem): IPartnerCvInput {
  const fileName = document.File?.Name || document.Title || `CV document ${document.Id}`;
  const profileTitle = cleanProfileTitle(document.Title || fileName);
  const skills = inferSkillsFromText(`${profileTitle} ${fileName}`);
  const cvUrl = buildAbsoluteSharePointUrl(siteUrl, document);

  return {
    title: profileTitle,
    candidateId: `DOC-${document.Id}`,
    profileTitle,
    seniority: inferSeniority(`${profileTitle} ${fileName}`),
    availability: 'Availability to confirm',
    skills,
    summary: `Anonymized profile imported from SharePoint document "${fileName}". Initial metadata was inferred from the document name and library metadata.`,
    cvUrl,
    cvUrlDescription: fileName
  };
}

function filterProfiles(sourceProfiles: CandidateProfile[], selectedSkills: string[], seniority: string, availability: string): CandidateProfile[] {
  return sourceProfiles
    .filter((profile) => !seniority || profile.seniority === seniority)
    .filter((profile) => !availability || profile.availability === availability)
    .map((profile) => ({
      ...profile,
      score: scoreProfile(profile, selectedSkills)
    }))
    .sort((left, right) => (right.score || 0) - (left.score || 0));
}

export default function CvTech2PartnerPortal({ webPartProps, spHttpClient, siteUrl, userDisplayName, userEmail }: Props): JSX.Element {
  const {
    portalTemplate,
    brandLabel,
    portalTitle,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    partnerMonthlyQuota,
    overviewPosition,
    missionMatchPosition,
    cvLibraryPosition,
    plansPosition,
    compliancePosition
  } = webPartProps;

  const rootRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef(new SharePointPartnerPortalService(spHttpClient, siteUrl));
  const [containerWidth, setContainerWidth] = useState(webPartMaxWidth);
  const [missionBrief, setMissionBrief] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Azure', 'IAM', 'Terraform']);
  const [seniority, setSeniority] = useState('');
  const [availability, setAvailability] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [availableProfiles, setAvailableProfiles] = useState<CandidateProfile[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(true);
  const [dataError, setDataError] = useState('');
  const [missionError, setMissionError] = useState('');
  const [partnerMissions, setPartnerMissions] = useState<IPartnerMissionItem[]>([]);
  const [isLoadingMissions, setIsLoadingMissions] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [adminError, setAdminError] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [isImportingDocuments, setIsImportingDocuments] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchesRemaining, setSearchesRemaining] = useState(partnerMonthlyQuota);

  useEffect(() => {
    serviceRef.current = new SharePointPartnerPortalService(spHttpClient, siteUrl);
  }, [siteUrl, spHttpClient]);

  useEffect(() => {
    const measure = (): void => {
      const width = rootRef.current?.getBoundingClientRect().width;
      if (width) setContainerWidth(width);
    };

    measure();

    if (typeof ResizeObserver !== 'undefined' && rootRef.current) {
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(rootRef.current);
      return () => resizeObserver.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCvs(): Promise<void> {
      setIsLoadingCvs(true);
      setDataError('');

      try {
        const items = await serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit);
        if (!isMounted) return;
        setAvailableProfiles(items.map(mapSharePointCv));
      } catch (error) {
        if (!isMounted) return;
        setDataError(error instanceof Error ? error.message : 'Unable to load CVs from SharePoint.');
        setAvailableProfiles([]);
      } finally {
        if (isMounted) setIsLoadingCvs(false);
      }
    }

    loadCvs().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [webPartProps.cvListTitle, webPartProps.cvRowLimit]);

  const loadPartnerMissions = async (): Promise<void> => {
    setIsLoadingMissions(true);
    setMissionError('');

    try {
      const missions = await serviceRef.current.getPartnerMissions(
        webPartProps.missionListTitle,
        webPartProps.partnerName,
        100
      );
      setPartnerMissions(missions);
    } catch (error) {
      setMissionError(error instanceof Error ? error.message : 'Unable to load partner missions from SharePoint.');
      setPartnerMissions([]);
    } finally {
      setIsLoadingMissions(false);
    }
  };

  useEffect(() => {
    loadPartnerMissions().catch(() => undefined);
  }, [webPartProps.missionListTitle, webPartProps.partnerName]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess(): Promise<void> {
      setIsCheckingAdmin(true);
      setAdminError('');

      try {
        const hasAccess = await serviceRef.current.isPartnerPortalAdmin(webPartProps.adminListTitle, userEmail);
        if (!isMounted) return;
        setIsAdmin(hasAccess);
        if (!hasAccess && activeSection === 'administration') {
          setActiveSection('overview');
        }
      } catch (error) {
        if (!isMounted) return;
        setIsAdmin(false);
        setAdminError(error instanceof Error ? error.message : 'Unable to check Partner Portal admin access.');
      } finally {
        if (isMounted) setIsCheckingAdmin(false);
      }
    }

    checkAdminAccess().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [activeSection, userEmail, webPartProps.adminListTitle]);

  const rankedProfiles = useMemo(() => {
    return filterProfiles(availableProfiles, selectedSkills, seniority, availability);
  }, [availability, availableProfiles, seniority, selectedSkills]);

  const toggleSkill = (skill: string): void => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  };

  const addSkill = (): void => {
    const value = skillInput.trim();
    if (!value) return;

    setSelectedSkills((current) => current.includes(value) ? current : [...current, value]);
    setSkillInput('');
  };

  const extractSkillsFromBrief = (): void => {
    const lower = missionBrief.toLowerCase();
    const extracted = suggestedSkills.filter((skill) => lower.includes(skill.toLowerCase()));
    const nextSkills = Array.from(new Set([...selectedSkills, ...extracted]));
    setSelectedSkills(nextSkills);
    logSearch(nextSkills).catch((error) => {
      setSearchStatus(error instanceof Error ? error.message : 'Search log failed.');
    });
    navigateToSection('mission-match');
  };

  const logSearch = async (skillsForSearch = selectedSkills): Promise<void> => {
    setSearchStatus('Logging search...');
    const monthKey = getMonthKey(new Date());
    const usedSearches = await serviceRef.current.countMonthlySearches(
      webPartProps.auditListTitle,
      webPartProps.partnerName,
      userEmail,
      monthKey
    );
    const results = filterProfiles(availableProfiles, skillsForSearch, seniority, availability);
    const remaining = Math.max(0, partnerMonthlyQuota - usedSearches - 1);
    const missionTitle = missionBrief.trim().split(/\n|[.!?]/)[0]?.trim() || `Skills search: ${skillsForSearch.slice(0, 3).join(', ')}`;

    await serviceRef.current.logSearch(webPartProps.auditListTitle, {
      title: `${webPartProps.partnerName} search ${new Date().toISOString()}`,
      partnerName: webPartProps.partnerName,
      userEmail,
      query: missionBrief,
      skills: skillsForSearch,
      resultsCount: results.length,
      quotaMaximum: partnerMonthlyQuota,
      searchesRemaining: remaining,
      monthKey
    });

    await serviceRef.current.savePartnerMission(webPartProps.missionListTitle, {
      title: missionTitle,
      partnerName: webPartProps.partnerName,
      userEmail,
      missionBrief,
      skills: skillsForSearch,
      seniority,
      availability,
      resultsCount: results.length
    });

    setSearchesRemaining(remaining);
    setSearchStatus(`Search logged. ${results.length} CV(s) found. ${remaining} search(es) remaining this month.`);
    await loadPartnerMissions();
  };

  const reuseMission = (mission: IPartnerMissionItem): void => {
    setMissionBrief(mission.MissionBrief || '');
    setSelectedSkills(splitSkills(mission.MissionSkills || ''));
    setSeniority(mission.Seniority || '');
    setAvailability(mission.Availability || '');
    setSearchStatus(`Loaded mission "${mission.Title || `#${mission.Id}`}". You can refine and search again.`);
  };

  const importCvDocuments = async (): Promise<void> => {
    setIsImportingDocuments(true);
    setAdminStatus('Scanning SharePoint CV documents...');
    setAdminError('');

    try {
      const [documents, existingCvs] = await Promise.all([
        serviceRef.current.getCvDocuments(webPartProps.cvDocumentLibraryTitle, webPartProps.cvRowLimit),
        serviceRef.current.getPartnerCvKeys(webPartProps.cvListTitle, webPartProps.cvRowLimit)
      ]);
      const existingCandidateIds = new Set(existingCvs.map((item) => item.CandidateId).filter(Boolean));
      const existingUrls = new Set(existingCvs.map((item) => item.CvUrl?.Url).filter(Boolean));
      const candidates = documents
        .map((document) => mapDocumentToPartnerCv(siteUrl, document))
        .filter((candidate) => !existingCandidateIds.has(candidate.candidateId) && !existingUrls.has(candidate.cvUrl));

      for (const candidate of candidates) {
        await serviceRef.current.createPartnerCv(webPartProps.cvListTitle, candidate);
      }

      setAdminStatus(`Import complete. ${documents.length} document(s) scanned, ${candidates.length} new PartnerCV item(s) created.`);
      const items = await serviceRef.current.getAvailableCvs(webPartProps.cvListTitle, webPartProps.cvRowLimit);
      setAvailableProfiles(items.map(mapSharePointCv));
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Unable to import CV documents.');
    } finally {
      setIsImportingDocuments(false);
    }
  };

  const navigateToSection = (sectionId: SectionId): void => {
    setActiveSection(sectionId);
  };

  const layoutMode: LayoutMode = containerWidth < 680 ? 'mobile' : containerWidth < 1060 ? 'tablet' : 'desktop';
  const sectionPositions: Record<SectionId, number> = {
    overview: overviewPosition,
    'mission-match': missionMatchPosition,
    'cv-library': cvLibraryPosition,
    plans: plansPosition,
    compliance: compliancePosition,
    administration: 99
  };
  const visibleNavItems = navItems.filter((item) => item.id !== 'administration' || isAdmin);
  const orderedNavItems = [...visibleNavItems].sort((left, right) =>
    (sectionPositions[left.id] - sectionPositions[right.id]) || (left.defaultOrder - right.defaultOrder)
  );
  const styles = buildStyles({
    portalTemplate,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    layoutMode
  });

  return (
    <div ref={rootRef} style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brandBlock}>
          <span style={styles.logoMark}>S</span>
          <div>
            <div style={styles.brand}>{activeSection === 'overview' ? 'SaaS Partner Cockpit' : brandLabel}</div>
            <p style={styles.brandCopy}>Partner access for anonymized CV discovery and mission matching.</p>
          </div>
        </div>
        <nav style={styles.nav}>
          {orderedNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              style={activeSection === item.id ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
              onClick={() => navigateToSection(item.id)}
            >
              <span style={styles.navGlyph}>{getSectionGlyph(item.id)}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={styles.headerActions}>
          <span style={styles.headerIcon}>!</span>
          <span style={styles.avatarBadge}>P</span>
          <span style={styles.chevron}>v</span>
        </div>
        <div style={activeSection === 'overview' ? styles.sidePanelHidden : styles.sidePanel}>
          <strong>Partner status</strong>
          <span>{webPartProps.partnerName}</span>
          <span>{searchesRemaining} / {partnerMonthlyQuota} searches remaining this month.</span>
        </div>
      </aside>

      <main style={styles.content}>
        {activeSection === 'overview' ? (
        <section id="overview" style={{ ...styles.overview, order: sectionPositions.overview }}>
          <div style={styles.overviewBackdrop}>
            <div style={styles.overviewHeroCopy}>
              <span style={styles.overviewKicker}>Partner access for anonymized<br />CV discovery and mission matching</span>
              <h1 style={styles.overviewHeadline}>Smarter matches.<br />Stronger missions.</h1>
              <p style={styles.overviewLead}>
                Discover anonymized talent, find the perfect fit,<br />and reveal identity only when you're ready.
              </p>
            </div>
            <div style={styles.overviewStatusCard}>
              <div style={styles.statusHeader}>
                <span style={styles.statusIcon}>P</span>
                <div>
                  <strong>Partner status</strong>
                  <span>{webPartProps.partnerName}</span>
                </div>
              </div>
              <div style={styles.quotaRow}>
                <span style={styles.quotaRing} />
                <div>
                  <strong>{searchesRemaining} / {partnerMonthlyQuota}</strong>
                  <span>searches remaining this month.</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.overviewCard}>
            <div style={styles.overviewCardTop}>
              <div style={styles.overviewCardCopy}>
                <span style={styles.eyebrow}>SaaS partner cockpit</span>
                <h2 style={styles.overviewTitle}>{portalTitle}</h2>
                <p style={styles.overviewBody}>
                  Search anonymized candidate profiles by skills or mission brief,
                  shortlist the best matches, and request controlled identity reveal
                  only when the fit is validated.
                </p>
                <div style={styles.heroActions}>
                  <button type="button" style={styles.primaryButton} onClick={extractSkillsFromBrief}>
                    <span style={styles.buttonIcon}>o</span>
                    Analyze mission
                    <span style={styles.buttonArrow}>-&gt;</span>
                  </button>
                  <button type="button" style={styles.secondaryButton} onClick={() => navigateToSection('plans')}>
                    <span style={styles.buttonIcon}>[]</span>
                    Request partner access
                  </button>
                </div>
              </div>
              <div style={styles.matchIllustration}>
                <span style={styles.radarCircleOuter} />
                <span style={styles.radarCircleInner} />
                <span style={styles.radarCrossHorizontal} />
                <span style={styles.radarCrossVertical} />
                <span style={styles.matchCheck}>OK</span>
                <span style={{ ...styles.profileChip, ...styles.profileChipLeft }}>
                  <span style={styles.chipAvatar}>P</span>
                  <span style={styles.chipLines}>
                    <span style={styles.chipLineLong} />
                    <span style={styles.chipLineShort} />
                  </span>
                </span>
                <span style={{ ...styles.profileChip, ...styles.profileChipRight }}>
                  <span style={styles.chipAvatar}>P</span>
                  <span style={styles.chipLines}>
                    <span style={styles.chipLineLong} />
                    <span style={styles.chipLineShort} />
                  </span>
                </span>
              </div>
            </div>

            <div style={styles.overviewDivider} />
            <div style={styles.overviewMetrics}>
              <Metric value={`${availableProfiles.length}`} label="Missions analyzed" detail="This month" icon="P" styles={styles} />
              <Metric value={isLoadingCvs ? '...' : `${rankedProfiles.length}`} label="Matches found" detail="This month" icon="D" styles={styles} />
              <Metric value="94%" label="Match success rate" detail="Validated fit" icon="/\\" styles={styles} />
            </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'mission-match' ? (
        <section id="mission-match" style={{ ...styles.searchBand, order: sectionPositions['mission-match'] }}>
          <div style={styles.searchHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Find available CVs</h2>
              <p style={styles.muted}>Work from explicit skills, a mission description, or both.</p>
            </div>
          </div>
          <div style={styles.searchGrid}>
            <div style={styles.panel}>
              <FieldLabel label="Mission / offer brief" />
              <textarea
                style={styles.textarea}
                value={missionBrief}
                onChange={(event) => setMissionBrief(event.currentTarget.value)}
                placeholder="Looking for a Cloud Security Architect with Azure landing zone, IAM, Terraform, and compliance exposure."
              />
              <FieldLabel label="Add explicit skills" />
              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Azure, Kubernetes, IAM..."
                />
                <button type="button" style={styles.compactButton} onClick={addSkill}>Add</button>
              </div>
              <button type="button" style={styles.primaryButton} onClick={() => logSearch()}>
                Search SharePoint CVs
              </button>
              {searchStatus ? <p style={styles.statusText}>{searchStatus}</p> : null}
              {dataError ? <p style={styles.errorText}>{dataError}</p> : null}
              <FieldLabel label="Suggested skills" />
              <div style={styles.chipRow}>
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    style={selectedSkills.includes(skill) ? { ...styles.chip, ...styles.chipActive } : styles.chip}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.panel}>
              <FieldLabel label="Partner mission history" />
              {isLoadingMissions ? <p style={styles.muted}>Loading partner missions...</p> : null}
              {missionError ? <p style={styles.errorText}>{missionError}</p> : null}
              {!isLoadingMissions && !missionError && partnerMissions.length === 0 ? (
                <p style={styles.muted}>No mission saved yet for {webPartProps.partnerName}.</p>
              ) : null}
              <div style={styles.missionList}>
                {partnerMissions.map((mission) => (
                  <article key={mission.Id} style={styles.missionCard}>
                    <div style={styles.missionHeader}>
                      <div>
                        <strong>{mission.Title || `Mission #${mission.Id}`}</strong>
                        <p style={styles.muted}>{formatMissionDate(mission.Created)} · {mission.UserEmail || 'Partner user'}</p>
                      </div>
                      <span style={styles.resultBadge}>{mission.ResultsCount || 0} CVs</span>
                    </div>
                    <p style={styles.profileSummary}>{mission.MissionBrief || 'No mission brief captured.'}</p>
                    <div style={styles.skillPills}>
                      {splitSkills(mission.MissionSkills || '').map((skill) => <span key={skill} style={styles.skillPill}>{skill}</span>)}
                    </div>
                    <p style={styles.muted}>
                      Criteria: {mission.Seniority || 'Any seniority'} · {mission.Availability || 'Any availability'}
                    </p>
                    <button type="button" style={styles.secondaryButton} onClick={() => reuseMission(mission)}>
                      Reuse criteria
                    </button>
                  </article>
                ))}
              </div>

              <FieldLabel label="Selected search" />
              <div style={styles.chipRow}>
                {selectedSkills.map((skill) => (
                  <span key={skill} style={{ ...styles.chip, ...styles.chipActive }}>{skill}</span>
                ))}
              </div>
              <div style={styles.twoColumn}>
                <div>
                  <FieldLabel label="Seniority" />
                  <select style={styles.input} value={seniority} onChange={(event) => setSeniority(event.currentTarget.value)}>
                    <option value="">Any</option>
                    <option>Senior</option>
                    <option>Lead</option>
                    <option>Architect</option>
                  </select>
                </div>
                <div>
                  <FieldLabel label="Availability" />
                  <select style={styles.input} value={availability} onChange={(event) => setAvailability(event.currentTarget.value)}>
                    <option value="">Any</option>
                    <option>Immediate</option>
                    <option>Under 2 weeks</option>
                    <option>Under 1 month</option>
                  </select>
                </div>
              </div>
              <div style={styles.workflow}>
                <WorkflowStep number="1" title="Discovery" text="Partners only search anonymized metadata." styles={styles} />
                <WorkflowStep number="2" title="Qualification" text="Shortlist profiles by skills, availability, and fit score." styles={styles} />
                <WorkflowStep number="3" title="Controlled reveal" text="Identity release requires approval and audit logging." styles={styles} />
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {activeSection === 'cv-library' ? (
        <section id="cv-library" style={{ ...styles.resultsPanel, order: sectionPositions['cv-library'] }}>
          <h2 style={styles.sectionTitle}>Matching candidate profiles</h2>
          <p style={styles.muted}>
            Results are loaded from the SharePoint list "{webPartProps.cvListTitle}" and each search is logged in "{webPartProps.auditListTitle}".
          </p>
          <div style={styles.resultList}>
            {isLoadingCvs ? <p style={styles.muted}>Loading SharePoint CVs...</p> : null}
            {!isLoadingCvs && rankedProfiles.length === 0 ? <p style={styles.muted}>No available CV matched the current search.</p> : null}
            {!isLoadingCvs && rankedProfiles.map((profile) => (
              <article key={profile.id} style={styles.cvCard}>
                <div style={styles.cvTop}>
                  <div>
                    <span style={styles.candidateId}>Candidate {profile.id}</span>
                    <h3 style={styles.cardTitle}>{profile.title}</h3>
                    <p style={styles.muted}>{profile.meta}</p>
                  </div>
                  <div style={styles.scoreBox}>
                    <strong>{profile.score}%</strong>
                    <span>fit</span>
                  </div>
                </div>
                <p style={styles.profileSummary}>{profile.summary}</p>
                <div style={styles.skillPills}>
                  {profile.skills.map((skill) => <span key={skill} style={styles.skillPill}>{skill}</span>)}
                </div>
                <div style={styles.cardActions}>
                  <button type="button" style={styles.primaryButton}>Request identity reveal</button>
                  {profile.cvUrl ? (
                    <a href={profile.cvUrl} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
                      Open CV
                    </a>
                  ) : (
                    <button type="button" style={styles.secondaryButton}>Save shortlist</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        {activeSection === 'plans' ? (
        <section id="plans" style={{ ...styles.resultsPanel, order: sectionPositions.plans }}>
          <h2 style={styles.sectionTitle}>SaaS plans</h2>
          <div style={styles.planList}>
            {plans.map((plan) => (
              <article key={plan.name} style={plan.featured ? { ...styles.plan, ...styles.featuredPlan } : styles.plan}>
                <h3 style={styles.planTitle}>{plan.name}</h3>
                <p style={styles.planCopy}>{plan.detail}</p>
                <strong style={styles.price}>{plan.price}</strong>
                <ul style={styles.featureList}>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        {activeSection === 'compliance' ? (
        <section id="compliance" style={{ ...styles.resultsPanel, order: sectionPositions.compliance }}>
          <h2 style={styles.sectionTitle}>Compliance</h2>
          <WorkflowStep number="G" title="GDPR-first" text="Names, contacts, and raw CVs stay protected by default." styles={styles} />
          <WorkflowStep number="A" title="Audit trail" text="Searches, shortlists, and reveal requests can be logged." styles={styles} />
        </section>
        ) : null}

        {activeSection === 'administration' && isAdmin ? (
        <section id="administration" style={{ ...styles.resultsPanel, order: sectionPositions.administration }}>
          <h2 style={styles.sectionTitle}>Administration</h2>
          <p style={styles.muted}>
            Admin tools are visible only for active users declared in "{webPartProps.adminListTitle}".
          </p>
          <div style={styles.adminGrid}>
            <div style={styles.panel}>
              <FieldLabel label="SharePoint CV import" />
              <p style={styles.muted}>
                Scan PDF/DOCX files from "{webPartProps.cvDocumentLibraryTitle}" and create missing anonymized entries in "{webPartProps.cvListTitle}".
              </p>
              <div style={styles.workflow}>
                <WorkflowStep number="1" title="Scan documents" text="Read PDF/DOCX metadata from the configured SharePoint library." styles={styles} />
                <WorkflowStep number="2" title="Infer metadata" text="Build profile title, candidate alias, seniority, availability and skills from file metadata." styles={styles} />
                <WorkflowStep number="3" title="Fill PartnerCVs" text="Create only missing CV records and skip existing candidate/document URLs." styles={styles} />
              </div>
              <button type="button" style={styles.primaryButton} onClick={importCvDocuments} disabled={isImportingDocuments}>
                {isImportingDocuments ? 'Importing...' : 'Parse SharePoint documents into PartnerCVs'}
              </button>
              {adminStatus ? <p style={styles.statusText}>{adminStatus}</p> : null}
              {adminError ? <p style={styles.errorText}>{adminError}</p> : null}
            </div>
            <div style={styles.panel}>
              <FieldLabel label="Current configuration" />
              <div style={styles.configList}>
                <span>Admin list: <strong>{webPartProps.adminListTitle}</strong></span>
                <span>Document library: <strong>{webPartProps.cvDocumentLibraryTitle}</strong></span>
                <span>Target CV list: <strong>{webPartProps.cvListTitle}</strong></span>
                <span>Current user: <strong>{userEmail}</strong></span>
                <span>Admin check: <strong>{isCheckingAdmin ? 'checking...' : isAdmin ? 'allowed' : 'denied'}</strong></span>
              </div>
            </div>
          </div>
        </section>
        ) : null}
      </main>
    </div>
  );
}

function FieldLabel({ label }: { label: string }): JSX.Element {
  return <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>;
}

function getSectionGlyph(sectionId: SectionId): string {
  switch (sectionId) {
    case 'overview':
      return 'O';
    case 'mission-match':
      return 'M';
    case 'cv-library':
      return 'CV';
    case 'plans':
      return 'P';
    case 'compliance':
      return 'C';
    case 'administration':
      return 'A';
    default:
      return '';
  }
}

function Metric({
  value,
  label,
  detail,
  icon,
  styles
}: {
  value: string;
  label: string;
  detail?: string;
  icon?: string;
  styles: Record<string, React.CSSProperties>;
}): JSX.Element {
  return (
    <div style={styles.metric}>
      {icon ? <span style={styles.metricIcon}>{icon}</span> : null}
      <span style={styles.metricCopy}>
        <strong>{value}</strong>
        <span>{label}</span>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}

function WorkflowStep({ number, title, text, styles }: { number: string; title: string; text: string; styles: Record<string, React.CSSProperties> }): JSX.Element {
  return (
    <div style={styles.workflowStep}>
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

interface StyleOptions {
  portalTemplate: PartnerPortalTemplate;
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
  layoutMode: LayoutMode;
}

function buildTemplateTokens(
  portalTemplate: PartnerPortalTemplate,
  primaryColor: string,
  secondaryColor: string,
  accentTextColor: string,
  surfaceColor: string
): TemplateTokens {
  const defaultHeroColumns = (metricMinWidth: number, sectionGap: number): string =>
    `minmax(0,1.3fr) minmax(${metricMinWidth * 2 + sectionGap}px,0.9fr)`;

  switch (portalTemplate) {
    case 'executive-partner':
      return {
        navigation: 'top',
        shellBackground: '#f7f9fb',
        sidebarBackground: '#ffffff',
        sidebarTextColor: accentTextColor,
        sidebarMutedColor: '#607078',
        sidebarRadius: 0,
        sidebarShadow: '0 10px 28px rgba(15,23,42,0.06)',
        navTextColor: accentTextColor,
        navActiveBackground: 'rgba(19,109,112,0.1)',
        navActiveTextColor: secondaryColor,
        sidePanelBackground: '#eef6f7',
        cardBackground: '#ffffff',
        panelBackground: '#f8fbfc',
        cardBorder: '1px solid rgba(16,36,46,0.1)',
        cardShadow: '0 18px 42px rgba(15,23,42,0.08)',
        mutedTextColor: '#5a6f77',
        fontFamily: 'Georgia, Aptos, Segoe UI, sans-serif',
        heroColumns: defaultHeroColumns,
        cardRadius: (borderRadius) => Math.max(6, borderRadius)
      };
    case 'marketplace-talent':
      return {
        navigation: 'side',
        shellBackground: '#f3faf9',
        sidebarBackground: `linear-gradient(160deg, ${secondaryColor}, #0d3439)`,
        sidebarTextColor: '#ffffff',
        sidebarMutedColor: 'rgba(255,255,255,0.76)',
        sidebarRadius: 28,
        sidebarShadow: '0 22px 50px rgba(13,52,57,0.22)',
        navTextColor: '#ffffff',
        navActiveBackground: 'rgba(255,255,255,0.2)',
        navActiveTextColor: '#ffffff',
        sidePanelBackground: 'rgba(255,255,255,0.14)',
        cardBackground: '#ffffff',
        panelBackground: '#f0fbfb',
        cardBorder: '1px solid rgba(39,194,198,0.18)',
        cardShadow: '0 14px 30px rgba(15,23,42,0.07)',
        mutedTextColor: '#55727b',
        fontFamily: 'Aptos, Segoe UI, sans-serif',
        heroColumns: (_metricMinWidth, _sectionGap) => 'minmax(0,0.9fr) minmax(0,1.1fr)',
        cardRadius: (borderRadius) => Math.max(18, borderRadius)
      };
    case 'mission-match-studio':
      return {
        navigation: 'top',
        shellBackground: `radial-gradient(circle at top left, rgba(39,194,198,0.2), transparent 34%), linear-gradient(135deg, #10242e, ${secondaryColor})`,
        sidebarBackground: 'rgba(255,255,255,0.08)',
        sidebarTextColor: '#ffffff',
        sidebarMutedColor: 'rgba(255,255,255,0.72)',
        sidebarRadius: 26,
        sidebarShadow: 'none',
        navTextColor: '#ffffff',
        navActiveBackground: primaryColor,
        navActiveTextColor: '#ffffff',
        sidePanelBackground: 'rgba(255,255,255,0.12)',
        cardBackground: 'rgba(255,255,255,0.96)',
        panelBackground: 'rgba(255,255,255,0.88)',
        cardBorder: '1px solid rgba(255,255,255,0.34)',
        cardShadow: '0 24px 64px rgba(0,0,0,0.22)',
        mutedTextColor: '#5e7278',
        fontFamily: 'Aptos Display, Aptos, Segoe UI, sans-serif',
        heroColumns: (_metricMinWidth, _sectionGap) => 'minmax(0,1fr) minmax(280px,0.72fr)',
        cardRadius: (borderRadius) => Math.max(22, borderRadius)
      };
    case 'cockpit-saas':
    default:
      return {
        navigation: 'top',
        shellBackground: surfaceColor,
        sidebarBackground: '#ffffff',
        sidebarTextColor: accentTextColor,
        sidebarMutedColor: '#5f7680',
        sidebarRadius: 0,
        sidebarShadow: '0 1px 0 rgba(16,36,46,0.08)',
        navTextColor: accentTextColor,
        navActiveBackground: 'rgba(39,194,198,0.12)',
        navActiveTextColor: secondaryColor,
        sidePanelBackground: '#eef9fa',
        cardBackground: '#ffffff',
        panelBackground: '#f5fbfc',
        cardBorder: '1px solid rgba(16,36,46,0.08)',
        cardShadow: '0 16px 34px rgba(15,23,42,0.07)',
        mutedTextColor: '#55727b',
        fontFamily: 'Aptos, Segoe UI, sans-serif',
        heroColumns: defaultHeroColumns,
        cardRadius: (borderRadius) => borderRadius
      };
  }
}

function buildStyles(options: StyleOptions): Record<string, React.CSSProperties> {
  const {
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor,
    webPartMaxWidth,
    sidebarWidth,
    minHeight,
    contentPadding,
    sectionGap,
    cardPadding,
    borderRadius,
    metricMinWidth,
    metricMinHeight,
    titleFontSize,
    bodyFontSize,
    portalTemplate,
    layoutMode
  } = options;
  const isDesktop = layoutMode === 'desktop';
  const isMobile = layoutMode === 'mobile';
  const compactPadding = isMobile ? Math.max(12, Math.round(contentPadding * 0.55)) : contentPadding;
  const compactCardPadding = isMobile ? Math.max(12, Math.round(cardPadding * 0.72)) : cardPadding;
  const effectiveTitleSize = isMobile ? Math.max(30, Math.round(titleFontSize * 0.7)) : layoutMode === 'tablet' ? Math.max(34, Math.round(titleFontSize * 0.82)) : titleFontSize;
  const effectiveBodySize = isMobile ? Math.max(14, bodyFontSize - 2) : bodyFontSize;

  const template = buildTemplateTokens(portalTemplate, primaryColor, secondaryColor, accentTextColor, surfaceColor);
  const usesTopNavigation = template.navigation === 'top';
  const isCockpitSaas = portalTemplate === 'cockpit-saas';
  const headerPadding = isMobile ? `${compactPadding}px` : `${Math.max(18, compactPadding - 4)}px ${Math.max(28, compactPadding + 18)}px`;

  return {
    shell: {
      display: 'grid',
      gridTemplateColumns: isDesktop && !usesTopNavigation ? `${sidebarWidth}px minmax(0, 1fr)` : 'minmax(0, 1fr)',
      width: '100%',
      maxWidth: webPartMaxWidth,
      minWidth: 0,
      minHeight: isMobile ? 'auto' : minHeight,
      margin: '0 auto',
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: accentTextColor,
      background: template.shellBackground,
      fontFamily: template.fontFamily,
      fontSize: effectiveBodySize,
      borderRadius: isCockpitSaas ? (isMobile ? 0 : 18) : undefined,
      border: isCockpitSaas ? '1px solid rgba(16,36,46,0.08)' : undefined,
      boxShadow: isCockpitSaas ? '0 18px 64px rgba(15,23,42,0.08)' : undefined
    },
    sidebar: {
      background: template.sidebarBackground,
      color: template.sidebarTextColor,
      padding: isCockpitSaas ? headerPadding : isDesktop ? `${compactPadding + 2}px ${Math.max(16, compactPadding - 8)}px` : `${compactPadding}px`,
      display: 'flex',
      flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: isCockpitSaas ? (isMobile ? 12 : 20) : isMobile ? 14 : sectionGap,
      alignItems: isDesktop && !usesTopNavigation ? 'stretch' : 'center',
      borderRadius: template.sidebarRadius,
      boxShadow: template.sidebarShadow,
      justifyContent: isCockpitSaas ? 'space-between' : undefined
    },
    brandBlock: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? 10 : 14,
      minWidth: 0,
      flex: isCockpitSaas ? '0 0 auto' : undefined
    },
    logoMark: {
      width: isMobile ? 34 : 42,
      height: isMobile ? 34 : 42,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      borderRadius: 12,
      color: '#ffffff',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      fontWeight: 900,
      fontSize: isMobile ? 18 : 22,
      transform: 'skew(-8deg)'
    },
    brand: {
      fontSize: isCockpitSaas ? (isMobile ? 17 : 18) : isMobile ? 30 : 38,
      fontWeight: 800,
      textTransform: isCockpitSaas ? 'none' : 'lowercase',
      whiteSpace: isCockpitSaas ? 'nowrap' : undefined
    },
    brandCopy: { display: isCockpitSaas ? 'none' : undefined, margin: '8px 0 0', lineHeight: 1.45, color: template.sidebarMutedColor, maxWidth: isDesktop && !usesTopNavigation ? 'none' : 460 },
    nav: {
      display: 'flex',
      flexDirection: isDesktop && !usesTopNavigation ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: isCockpitSaas ? 10 : 8,
      flex: isCockpitSaas ? '1 1 auto' : isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 420px',
      justifyContent: isCockpitSaas ? 'center' : undefined,
      alignItems: 'center'
    },
    navItem: {
      padding: isCockpitSaas ? (isMobile ? '10px 12px' : '13px 18px') : isMobile ? '10px 12px' : '13px 14px',
      border: 'none',
      borderRadius: isCockpitSaas ? 11 : borderRadius,
      background: 'transparent',
      color: template.navTextColor,
      cursor: 'pointer',
      font: 'inherit',
      fontWeight: 700,
      textAlign: 'left',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap'
    },
    navItemActive: { background: template.navActiveBackground, color: template.navActiveTextColor },
    navGlyph: {
      width: 22,
      height: 22,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      border: '1px solid currentColor',
      fontSize: 10,
      fontWeight: 900,
      lineHeight: 1
    },
    headerActions: {
      display: isCockpitSaas ? 'inline-flex' : 'none',
      alignItems: 'center',
      gap: 13,
      flex: '0 0 auto',
      color: accentTextColor
    },
    headerIcon: {
      width: 28,
      height: 28,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      border: '1px solid rgba(16,36,46,0.12)',
      color: secondaryColor,
      fontWeight: 900
    },
    avatarBadge: {
      width: 36,
      height: 36,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 800
    },
    chevron: { fontSize: 14, color: '#49646e', fontWeight: 800 },
    sidePanel: { marginTop: isDesktop && !usesTopNavigation ? 'auto' : 0, padding: compactCardPadding, borderRadius, background: template.sidePanelBackground, display: 'grid', gap: 8, flex: isDesktop && !usesTopNavigation ? '0 0 auto' : '1 1 280px' },
    sidePanelHidden: { display: 'none' },
    content: { padding: isCockpitSaas ? 0 : compactPadding, display: 'grid', gap: sectionGap, minWidth: 0 },
    overview: {
      position: 'relative',
      display: 'grid',
      minWidth: 0,
      overflow: 'hidden',
      background: '#eef7fb',
      scrollMarginTop: sectionGap
    },
    overviewBackdrop: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(330px,0.78fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 26 : 42,
      alignItems: 'center',
      padding: isMobile ? '44px 24px 86px' : '58px 72px 112px',
      minHeight: isMobile ? 420 : 390,
      background: `radial-gradient(circle at 88% 42%, rgba(72,255,238,0.78), transparent 28%), radial-gradient(circle at 54% 88%, rgba(39,194,198,0.35), transparent 30%), linear-gradient(118deg, #063641 0%, #006d77 48%, ${primaryColor} 100%)`,
      color: '#ffffff',
      overflow: 'hidden'
    },
    overviewHeroCopy: { position: 'relative', zIndex: 1, maxWidth: 650 },
    overviewKicker: {
      display: 'inline-block',
      color: '#5df7f0',
      fontSize: isMobile ? 12 : 15,
      lineHeight: 1.5,
      letterSpacing: 3.2,
      textTransform: 'uppercase',
      fontWeight: 800
    },
    overviewHeadline: {
      margin: isMobile ? '24px 0 18px' : '28px 0 20px',
      fontSize: isMobile ? 44 : 58,
      lineHeight: 1.08,
      fontWeight: 900,
      letterSpacing: -1.5,
      textShadow: '0 8px 22px rgba(0,0,0,0.28)'
    },
    overviewLead: {
      margin: 0,
      fontSize: isMobile ? 18 : 20,
      lineHeight: 1.52,
      color: 'rgba(255,255,255,0.9)'
    },
    overviewStatusCard: {
      position: 'relative',
      zIndex: 1,
      justifySelf: isDesktop ? 'end' : 'stretch',
      width: isDesktop ? 480 : 'auto',
      maxWidth: '100%',
      padding: isMobile ? 26 : 34,
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))',
      border: '1px solid rgba(255,255,255,0.36)',
      boxShadow: '0 24px 56px rgba(0,62,73,0.24)',
      backdropFilter: 'blur(12px)',
      display: 'grid',
      gap: 26
    },
    statusHeader: { display: 'grid', gridTemplateColumns: '58px minmax(0,1fr)', gap: 18, alignItems: 'center' },
    statusIcon: {
      width: 58,
      height: 58,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, #57efe7)`,
      fontWeight: 900,
      color: '#ffffff',
      boxShadow: '0 12px 26px rgba(0,0,0,0.18)'
    },
    quotaRow: {
      display: 'grid',
      gridTemplateColumns: '68px minmax(0,1fr)',
      gap: 18,
      alignItems: 'center',
      paddingTop: 22,
      borderTop: '1px solid rgba(255,255,255,0.18)'
    },
    quotaRing: {
      width: 56,
      height: 56,
      borderRadius: 999,
      border: '10px solid rgba(255,255,255,0.35)',
      borderLeftColor: '#61fff0',
      borderBottomColor: '#61fff0',
      display: 'inline-block'
    },
    overviewCard: {
      position: 'relative',
      zIndex: 2,
      margin: isMobile ? '-56px 18px 24px' : '-66px 50px 34px',
      padding: isMobile ? 24 : 40,
      borderRadius: 14,
      background: '#ffffff',
      boxShadow: '0 26px 70px rgba(15,23,42,0.14)',
      minWidth: 0
    },
    overviewCardTop: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'minmax(0,0.82fr) minmax(320px,0.72fr)' : 'minmax(0,1fr)',
      gap: isMobile ? 28 : 38,
      alignItems: 'center'
    },
    overviewCardCopy: { minWidth: 0, maxWidth: 650 },
    overviewTitle: {
      margin: '12px 0 18px',
      fontSize: isMobile ? 46 : 68,
      lineHeight: 0.98,
      fontWeight: 900,
      letterSpacing: -2.4,
      color: '#062838',
      textShadow: '0 8px 18px rgba(4,38,52,0.12)'
    },
    overviewBody: {
      margin: 0,
      color: '#39556b',
      lineHeight: 1.48,
      fontSize: isMobile ? 17 : 18,
      maxWidth: 560
    },
    buttonIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      borderRadius: 999,
      border: '1px solid currentColor',
      fontSize: 12,
      lineHeight: 1,
      fontWeight: 900
    },
    buttonArrow: { marginLeft: 8, fontWeight: 900 },
    matchIllustration: {
      position: 'relative',
      minHeight: isMobile ? 230 : 300,
      display: isMobile ? 'none' : 'block'
    },
    radarCircleOuter: {
      position: 'absolute',
      top: 10,
      left: '50%',
      width: 260,
      height: 260,
      marginLeft: -130,
      borderRadius: 999,
      border: '1px solid rgba(39,194,198,0.22)',
      background: 'radial-gradient(circle, rgba(39,194,198,0.16), rgba(39,194,198,0.03) 58%, transparent 60%)'
    },
    radarCircleInner: {
      position: 'absolute',
      top: 62,
      left: '50%',
      width: 156,
      height: 156,
      marginLeft: -78,
      borderRadius: 999,
      border: '1px dashed rgba(39,194,198,0.35)'
    },
    radarCrossHorizontal: {
      position: 'absolute',
      top: 140,
      left: '50%',
      width: 270,
      height: 1,
      marginLeft: -135,
      background: 'rgba(39,194,198,0.16)'
    },
    radarCrossVertical: {
      position: 'absolute',
      top: 10,
      left: '50%',
      width: 1,
      height: 260,
      background: 'rgba(39,194,198,0.16)'
    },
    matchCheck: {
      position: 'absolute',
      top: 112,
      left: '50%',
      width: 54,
      height: 54,
      marginLeft: -27,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900,
      boxShadow: '0 18px 30px rgba(0,116,124,0.24)'
    },
    profileChip: {
      position: 'absolute',
      width: 190,
      minHeight: 54,
      display: 'grid',
      gridTemplateColumns: '36px minmax(0,1fr)',
      gap: 12,
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      background: '#ffffff',
      border: '1px solid rgba(16,36,46,0.09)',
      boxShadow: '0 16px 38px rgba(15,23,42,0.12)'
    },
    profileChipLeft: { left: 0, top: 128 },
    profileChipRight: { right: 0, top: 58 },
    chipAvatar: {
      width: 34,
      height: 34,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900
    },
    chipLines: { display: 'grid', gap: 8 },
    chipLineLong: { display: 'block', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.14)' },
    chipLineShort: { display: 'block', width: '72%', height: 7, borderRadius: 999, background: 'rgba(16,36,46,0.1)' },
    overviewDivider: { height: 1, background: 'rgba(16,36,46,0.12)', margin: isMobile ? '24px 0' : '30px 0 24px' },
    overviewMetrics: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      gap: 24
    },
    hero: { display: 'grid', gridTemplateColumns: isDesktop ? template.heroColumns(metricMinWidth, sectionGap) : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), boxShadow: template.cardShadow, border: template.cardBorder, scrollMarginTop: sectionGap, minWidth: 0 },
    eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    title: { margin: '14px 0 12px', fontSize: effectiveTitleSize, lineHeight: 1.05, fontWeight: 800, overflowWrap: 'anywhere' },
    lead: { margin: 0, color: '#55727b', fontSize: effectiveBodySize, lineHeight: 1.55 },
    heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
    primaryButton: { border: 'none', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', padding: '12px 18px', borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    secondaryButton: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, padding: '12px 18px', borderRadius, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius, fontWeight: 800, cursor: 'pointer' },
    statsGrid: { display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${metricMinWidth}px,1fr))`, gap: 10, minWidth: 0 },
    metric: {
      background: '#f8fdff',
      border: '1px solid rgba(39,194,198,0.18)',
      borderRadius,
      padding: compactCardPadding,
      minHeight: metricMinHeight,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      minWidth: 0,
      overflowWrap: 'anywhere',
      boxShadow: '0 14px 30px rgba(15,23,42,0.04)'
    },
    metricIcon: {
      width: 76,
      height: 76,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      fontWeight: 900,
      fontSize: 24,
      boxShadow: '0 14px 26px rgba(0,116,124,0.18)'
    },
    metricCopy: { display: 'grid', gap: 4, minWidth: 0 },
    searchBand: { background: '#fff', borderRadius, boxShadow: '0 16px 34px rgba(15,23,42,0.07)', scrollMarginTop: sectionGap, minWidth: 0 },
    searchHeader: { padding: `${compactCardPadding}px ${compactCardPadding}px 0` },
    searchGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, minWidth: 0 },
    sectionTitle: { margin: 0, fontSize: isMobile ? 24 : 28, lineHeight: 1.15, fontWeight: 800 },
    muted: { margin: '8px 0 0', color: template.mutedTextColor, lineHeight: 1.5 },
    statusText: { margin: '0', color: secondaryColor, fontWeight: 700, lineHeight: 1.45 },
    errorText: { margin: '0', color: '#b42318', fontWeight: 700, lineHeight: 1.45 },
    panel: { background: template.panelBackground, border: template.cardBorder, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 14, minWidth: 0 },
    textarea: { minHeight: isMobile ? 112 : 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', boxSizing: 'border-box', width: '100%', minWidth: 0 },
    inputRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto', gap: 10, minWidth: 0 },
    input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box' },
    chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
    chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
    twoColumn: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 12 },
    workflow: { display: 'grid', gap: 10 },
    workflowStep: { display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: 10, alignItems: 'start', padding: 12, background: '#fff', borderRadius, border: '1px solid rgba(16,36,46,0.08)', minWidth: 0 },
    adminGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.2fr) minmax(280px,0.8fr)' : 'minmax(0,1fr)', gap: sectionGap, marginTop: 18, minWidth: 0 },
    configList: { display: 'grid', gap: 10, lineHeight: 1.45, overflowWrap: 'anywhere' },
    missionList: { display: 'grid', gap: 12 },
    missionCard: { background: '#fff', border: template.cardBorder, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, display: 'grid', gap: 10, minWidth: 0 },
    missionHeader: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 10, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
    resultBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 72, padding: '8px 10px', borderRadius: 999, background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', fontWeight: 800 },
    resultsLayout: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.4fr) minmax(280px,360px)' : 'minmax(0,1fr)', gap: sectionGap, scrollMarginTop: sectionGap, minWidth: 0 },
    resultsPanel: { background: template.cardBackground, borderRadius: template.cardRadius(borderRadius), padding: compactCardPadding, boxShadow: template.cardShadow, border: template.cardBorder, scrollMarginTop: sectionGap, minWidth: 0 },
    resultList: { display: 'grid', gap: 14, marginTop: 18 },
    cvCard: { border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: compactCardPadding, background: '#fdfefe', minWidth: 0 },
    cvTop: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 16, alignItems: isMobile ? 'stretch' : 'flex-start', minWidth: 0 },
    candidateId: { display: 'inline-block', background: 'rgba(39,194,198,0.12)', color: secondaryColor, borderRadius: 999, padding: '7px 10px', fontWeight: 800, fontSize: 12 },
    cardTitle: { margin: '10px 0 0', fontSize: isMobile ? 21 : 24, lineHeight: 1.15, overflowWrap: 'anywhere' },
    scoreBox: { minWidth: 96, textAlign: isMobile ? 'left' : 'right', background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: 12 },
    profileSummary: { margin: '12px 0', color: '#55727b', lineHeight: 1.5 },
    skillPills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
    skillPill: { background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 999, padding: '6px 9px', fontSize: 12, fontWeight: 700 },
    cardActions: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 },
    asideStack: { display: 'grid', gap: 18, alignContent: 'start' },
    planList: { display: 'grid', gap: 12, marginTop: 16 },
    plan: { border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: compactCardPadding, background: '#fdfefe' },
    featuredPlan: { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', borderColor: 'transparent' },
    planTitle: { margin: 0, fontSize: 21 },
    planCopy: { margin: '8px 0', lineHeight: 1.45 },
    price: { display: 'block', fontSize: 30, margin: '10px 0' },
    featureList: { margin: 0, paddingLeft: 18, lineHeight: 1.7 }
  };
}
