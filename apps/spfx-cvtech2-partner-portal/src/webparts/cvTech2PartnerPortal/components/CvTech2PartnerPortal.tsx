import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SPHttpClient } from '@microsoft/sp-http';
import type { ICvTech2PartnerPortalWebPartProps } from '../CvTech2PartnerPortalWebPart';
import { IPartnerCvListItem, SharePointPartnerPortalService } from '../services/SharePointPartnerPortalService';

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

type SectionId = 'overview' | 'cv-library' | 'mission-match' | 'plans' | 'compliance';

const navItems: Array<{ id: SectionId; label: string; defaultOrder: number }> = [
  { id: 'overview', label: 'Overview', defaultOrder: 1 },
  { id: 'mission-match', label: 'Mission Match', defaultOrder: 2 },
  { id: 'cv-library', label: 'CV Library', defaultOrder: 3 },
  { id: 'plans', label: 'Plans', defaultOrder: 4 },
  { id: 'compliance', label: 'Compliance', defaultOrder: 5 }
];

function scoreProfile(profile: CandidateProfile, selectedSkills: string[]): number {
  const matches = selectedSkills.filter((skill) =>
    profile.skills.some((profileSkill) => profileSkill.toLowerCase() === skill.toLowerCase())
  ).length;

  return Math.min(99, 62 + matches * 9);
}

type LayoutMode = 'desktop' | 'tablet' | 'mobile';

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
  const [activeSection, setActiveSection] = useState('overview');
  const [availableProfiles, setAvailableProfiles] = useState<CandidateProfile[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(true);
  const [dataError, setDataError] = useState('');
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

    setSearchesRemaining(remaining);
    setSearchStatus(`Search logged. ${results.length} CV(s) found. ${remaining} search(es) remaining this month.`);
  };

  const navigateToSection = (sectionId: string): void => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const layoutMode: LayoutMode = containerWidth < 680 ? 'mobile' : containerWidth < 1060 ? 'tablet' : 'desktop';
  const sectionPositions: Record<SectionId, number> = {
    overview: overviewPosition,
    'mission-match': missionMatchPosition,
    'cv-library': cvLibraryPosition,
    plans: plansPosition,
    compliance: compliancePosition
  };
  const orderedNavItems = [...navItems].sort((left, right) =>
    (sectionPositions[left.id] - sectionPositions[right.id]) || (left.defaultOrder - right.defaultOrder)
  );
  const styles = buildStyles({
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
        <div>
          <div style={styles.brand}>{brandLabel}</div>
          <p style={styles.brandCopy}>Partner access for anonymized CV discovery and mission matching.</p>
        </div>
        <nav style={styles.nav}>
          {orderedNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              style={activeSection === item.id ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
              onClick={() => navigateToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div style={styles.sidePanel}>
          <strong>Partner status</strong>
          <span>{webPartProps.partnerName}</span>
          <span>{searchesRemaining} / {partnerMonthlyQuota} searches remaining this month.</span>
        </div>
      </aside>

      <main style={styles.content}>
        <section id="overview" style={{ ...styles.hero, order: sectionPositions.overview }}>
          <div>
            <span style={styles.eyebrow}>SaaS partner cockpit</span>
            <h1 style={styles.title}>{portalTitle}</h1>
            <p style={styles.lead}>
              Search anonymized candidate profiles by skills or mission brief, shortlist the best matches,
              and request controlled identity reveal only when the fit is validated.
            </p>
            <div style={styles.heroActions}>
              <button type="button" style={styles.primaryButton} onClick={extractSkillsFromBrief}>
                Analyze mission
              </button>
              <button type="button" style={styles.secondaryButton} onClick={() => navigateToSection('plans')}>
                Request partner access
              </button>
            </div>
          </div>
          <div style={styles.statsGrid}>
            <Metric value={`${availableProfiles.length}`} label="available SharePoint CVs" styles={styles} />
            <Metric value={isLoadingCvs ? '...' : `${rankedProfiles.length}`} label="matching current search" styles={styles} />
            <Metric value="94%" label="curated match relevance" styles={styles} />
            <Metric value={`${searchesRemaining}`} label="searches remaining" styles={styles} />
          </div>
        </section>

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

        <section id="compliance" style={{ ...styles.resultsPanel, order: sectionPositions.compliance }}>
          <h2 style={styles.sectionTitle}>Compliance</h2>
          <WorkflowStep number="G" title="GDPR-first" text="Names, contacts, and raw CVs stay protected by default." styles={styles} />
          <WorkflowStep number="A" title="Audit trail" text="Searches, shortlists, and reveal requests can be logged." styles={styles} />
        </section>
      </main>
    </div>
  );
}

function FieldLabel({ label }: { label: string }): JSX.Element {
  return <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>;
}

function Metric({ value, label, styles }: { value: string; label: string; styles: Record<string, React.CSSProperties> }): JSX.Element {
  return (
    <div style={styles.metric}>
      <strong>{value}</strong>
      <span>{label}</span>
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
    layoutMode
  } = options;
  const isDesktop = layoutMode === 'desktop';
  const isMobile = layoutMode === 'mobile';
  const compactPadding = isMobile ? Math.max(12, Math.round(contentPadding * 0.55)) : contentPadding;
  const compactCardPadding = isMobile ? Math.max(12, Math.round(cardPadding * 0.72)) : cardPadding;
  const effectiveTitleSize = isMobile ? Math.max(30, Math.round(titleFontSize * 0.7)) : layoutMode === 'tablet' ? Math.max(34, Math.round(titleFontSize * 0.82)) : titleFontSize;
  const effectiveBodySize = isMobile ? Math.max(14, bodyFontSize - 2) : bodyFontSize;

  return {
    shell: {
      display: 'grid',
      gridTemplateColumns: isDesktop ? `${sidebarWidth}px minmax(0, 1fr)` : 'minmax(0, 1fr)',
      width: '100%',
      maxWidth: webPartMaxWidth,
      minWidth: 0,
      minHeight: isMobile ? 'auto' : minHeight,
      margin: '0 auto',
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: accentTextColor,
      background: surfaceColor,
      fontFamily: 'Aptos, Segoe UI, sans-serif',
      fontSize: effectiveBodySize
    },
    sidebar: {
      background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
      color: '#fff',
      padding: isDesktop ? `${compactPadding + 2}px ${Math.max(16, compactPadding - 8)}px` : `${compactPadding}px`,
      display: 'flex',
      flexDirection: isDesktop ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: isMobile ? 14 : sectionGap,
      alignItems: isDesktop ? 'stretch' : 'center'
    },
    brand: { fontSize: isMobile ? 30 : 38, fontWeight: 800, textTransform: 'lowercase' },
    brandCopy: { margin: '8px 0 0', lineHeight: 1.45, color: 'rgba(255,255,255,0.82)', maxWidth: isDesktop ? 'none' : 460 },
    nav: { display: 'flex', flexDirection: isDesktop ? 'column' : 'row', flexWrap: 'wrap', gap: 8, flex: isDesktop ? '0 0 auto' : '1 1 420px' },
    navItem: {
      padding: isMobile ? '10px 12px' : '13px 14px',
      border: 'none',
      borderRadius,
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      font: 'inherit',
      fontWeight: 700,
      textAlign: 'left'
    },
    navItemActive: { background: 'rgba(255,255,255,0.18)' },
    sidePanel: { marginTop: isDesktop ? 'auto' : 0, padding: compactCardPadding, borderRadius, background: 'rgba(255,255,255,0.14)', display: 'grid', gap: 8, flex: isDesktop ? '0 0 auto' : '1 1 280px' },
    content: { padding: compactPadding, display: 'grid', gap: sectionGap, minWidth: 0 },
    hero: { display: 'grid', gridTemplateColumns: isDesktop ? `minmax(0,1.3fr) minmax(${metricMinWidth * 2 + sectionGap}px,0.9fr)` : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, background: '#fff', borderRadius, boxShadow: '0 16px 34px rgba(15,23,42,0.07)', scrollMarginTop: sectionGap, minWidth: 0 },
    eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    title: { margin: '14px 0 12px', fontSize: effectiveTitleSize, lineHeight: 1.05, fontWeight: 800, overflowWrap: 'anywhere' },
    lead: { margin: 0, color: '#55727b', fontSize: effectiveBodySize, lineHeight: 1.55 },
    heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
    primaryButton: { border: 'none', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', padding: '12px 16px', borderRadius, fontWeight: 800, cursor: 'pointer' },
    secondaryButton: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, padding: '12px 16px', borderRadius, fontWeight: 800, cursor: 'pointer' },
    compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius, fontWeight: 800, cursor: 'pointer' },
    statsGrid: { display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${metricMinWidth}px,1fr))`, gap: 10, minWidth: 0 },
    metric: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: compactCardPadding, minHeight: metricMinHeight, display: 'grid', alignContent: 'space-between', gap: 8, minWidth: 0, overflowWrap: 'anywhere' },
    searchBand: { background: '#fff', borderRadius, boxShadow: '0 16px 34px rgba(15,23,42,0.07)', scrollMarginTop: sectionGap, minWidth: 0 },
    searchHeader: { padding: `${compactCardPadding}px ${compactCardPadding}px 0` },
    searchGrid: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: sectionGap, padding: compactCardPadding, minWidth: 0 },
    sectionTitle: { margin: 0, fontSize: isMobile ? 24 : 28, lineHeight: 1.15, fontWeight: 800 },
    muted: { margin: '8px 0 0', color: '#55727b', lineHeight: 1.5 },
    statusText: { margin: '0', color: secondaryColor, fontWeight: 700, lineHeight: 1.45 },
    errorText: { margin: '0', color: '#b42318', fontWeight: 700, lineHeight: 1.45 },
    panel: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius, padding: compactCardPadding, display: 'grid', gap: 14, minWidth: 0 },
    textarea: { minHeight: isMobile ? 112 : 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', boxSizing: 'border-box', width: '100%', minWidth: 0 },
    inputRow: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'minmax(0,1fr) auto', gap: 10, minWidth: 0 },
    input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius, padding: 12, font: 'inherit', width: '100%', minWidth: 0, boxSizing: 'border-box' },
    chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
    chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
    twoColumn: { display: 'grid', gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 12 },
    workflow: { display: 'grid', gap: 10 },
    workflowStep: { display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: 10, alignItems: 'start', padding: 12, background: '#fff', borderRadius, border: '1px solid rgba(16,36,46,0.08)', minWidth: 0 },
    resultsLayout: { display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0,1.4fr) minmax(280px,360px)' : 'minmax(0,1fr)', gap: sectionGap, scrollMarginTop: sectionGap, minWidth: 0 },
    resultsPanel: { background: '#fff', borderRadius, padding: compactCardPadding, boxShadow: '0 16px 34px rgba(15,23,42,0.07)', scrollMarginTop: sectionGap, minWidth: 0 },
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
