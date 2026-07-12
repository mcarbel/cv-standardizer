import * as React from 'react';
import { useMemo, useState } from 'react';
import type { ICvTech2PartnerPortalWebPartProps } from '../CvTech2PartnerPortalWebPart';

interface Props {
  webPartProps: ICvTech2PartnerPortalWebPartProps;
}

interface CandidateProfile {
  id: string;
  title: string;
  meta: string;
  seniority: string;
  availability: string;
  skills: string[];
  summary: string;
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

const profiles: CandidateProfile[] = [
  {
    id: 'CSA-014',
    title: 'Cloud Security Architect',
    meta: 'Architect | Azure / GCP | Banking & compliance | Availability: 2 weeks',
    seniority: 'Architect',
    availability: 'Under 2 weeks',
    skills: ['Azure', 'IAM', 'Terraform', 'Landing Zone', 'GCP', 'Compliance'],
    summary: 'Strong alignment for cloud security transformation, IAM hardening, and regulated environments.'
  },
  {
    id: 'DEV-022',
    title: 'Platform Engineer',
    meta: 'Senior | Kubernetes / DevSecOps | FinOps aware | Availability: immediate',
    seniority: 'Senior',
    availability: 'Immediate',
    skills: ['Kubernetes', 'Azure', 'DevSecOps', 'Observability', 'CI/CD'],
    summary: 'Relevant for missions mixing platform engineering, cluster governance, and deployment automation.'
  },
  {
    id: 'ARC-037',
    title: 'Enterprise Cloud Architect',
    meta: 'Lead | Multi-cloud strategy | Enterprise migration | Availability: 1 month',
    seniority: 'Lead',
    availability: 'Under 1 month',
    skills: ['Azure', 'GCP', 'Migration', 'Networking', 'Security', 'Governance'],
    summary: 'Useful for architecture-heavy missions with a strong governance and transformation angle.'
  },
  {
    id: 'SAP-041',
    title: 'Data & AI Platform Consultant',
    meta: 'Senior | Data platform / Azure AI | Availability: immediate',
    seniority: 'Senior',
    availability: 'Immediate',
    skills: ['Azure AI', 'Data Platform', 'Python', 'MLOps', 'Databricks', 'Security'],
    summary: 'Good secondary fit when the mission blends cloud modernization, analytics, and secure platform setup.'
  }
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

function scoreProfile(profile: CandidateProfile, selectedSkills: string[]): number {
  const matches = selectedSkills.filter((skill) =>
    profile.skills.some((profileSkill) => profileSkill.toLowerCase() === skill.toLowerCase())
  ).length;

  return Math.min(99, 62 + matches * 9);
}

export default function CvTech2PartnerPortal({ webPartProps }: Props): JSX.Element {
  const {
    brandLabel,
    portalTitle,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor
  } = webPartProps;

  const [missionBrief, setMissionBrief] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Azure', 'IAM', 'Terraform']);
  const [seniority, setSeniority] = useState('');
  const [availability, setAvailability] = useState('');

  const rankedProfiles = useMemo(() => {
    return profiles
      .filter((profile) => !seniority || profile.seniority === seniority)
      .filter((profile) => !availability || profile.availability === availability)
      .map((profile) => ({
        ...profile,
        score: scoreProfile(profile, selectedSkills)
      }))
      .sort((left, right) => right.score - left.score);
  }, [availability, seniority, selectedSkills]);

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
    setSelectedSkills((current) => Array.from(new Set([...current, ...extracted])));
  };

  const styles = buildStyles(primaryColor, secondaryColor, accentTextColor, surfaceColor);

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>{brandLabel}</div>
          <p style={styles.brandCopy}>Partner access for anonymized CV discovery and mission matching.</p>
        </div>
        <nav style={styles.nav}>
          {['Overview', 'CV Library', 'Mission Match', 'Plans', 'Compliance'].map((label, index) => (
            <div key={label} style={index === 0 ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
              {label}
            </div>
          ))}
        </nav>
        <div style={styles.sidePanel}>
          <strong>Partner status</strong>
          <span>Enterprise workspace ready. Identity reveal remains approval-based.</span>
        </div>
      </aside>

      <main style={styles.content}>
        <section style={styles.hero}>
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
              <button type="button" style={styles.secondaryButton}>
                Request partner access
              </button>
            </div>
          </div>
          <div style={styles.statsGrid}>
            <Metric value="128" label="anonymized profiles" styles={styles} />
            <Metric value="21" label="new profiles this month" styles={styles} />
            <Metric value="94%" label="curated match relevance" styles={styles} />
            <Metric value="< 2h" label="reveal request triage" styles={styles} />
          </div>
        </section>

        <section style={styles.searchBand}>
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

        <section style={styles.resultsLayout}>
          <div style={styles.resultsPanel}>
            <h2 style={styles.sectionTitle}>Matching candidate profiles</h2>
            <p style={styles.muted}>Example result set; the next integration step is binding this to SharePoint metadata or a secure search index.</p>
            <div style={styles.resultList}>
              {rankedProfiles.map((profile) => (
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
                    <button type="button" style={styles.secondaryButton}>Save shortlist</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside style={styles.asideStack}>
            <div style={styles.resultsPanel}>
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
            </div>
            <div style={styles.resultsPanel}>
              <h2 style={styles.sectionTitle}>Compliance</h2>
              <WorkflowStep number="G" title="GDPR-first" text="Names, contacts, and raw CVs stay protected by default." styles={styles} />
              <WorkflowStep number="A" title="Audit trail" text="Searches, shortlists, and reveal requests can be logged." styles={styles} />
            </div>
          </aside>
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

function buildStyles(primaryColor: string, secondaryColor: string, accentTextColor: string, surfaceColor: string): Record<string, React.CSSProperties> {
  return {
    shell: {
      display: 'grid',
      gridTemplateColumns: '280px minmax(0, 1fr)',
      minHeight: 920,
      color: accentTextColor,
      background: surfaceColor,
      fontFamily: 'Aptos, Segoe UI, sans-serif'
    },
    sidebar: {
      background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
      color: '#fff',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },
    brand: { fontSize: 38, fontWeight: 800, textTransform: 'lowercase' },
    brandCopy: { margin: '8px 0 0', lineHeight: 1.45, color: 'rgba(255,255,255,0.82)' },
    nav: { display: 'grid', gap: 8 },
    navItem: { padding: '13px 14px', borderRadius: 8, fontWeight: 700 },
    navItemActive: { background: 'rgba(255,255,255,0.18)' },
    sidePanel: { marginTop: 'auto', padding: 16, borderRadius: 8, background: 'rgba(255,255,255,0.14)', display: 'grid', gap: 8 },
    content: { padding: 28, display: 'grid', gap: 22 },
    hero: { display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(320px,0.9fr)', gap: 20, padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
    eyebrow: { display: 'inline-block', color: secondaryColor, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
    title: { margin: '14px 0 12px', fontSize: 48, lineHeight: 1.05, fontWeight: 800 },
    lead: { margin: 0, color: '#55727b', fontSize: 17, lineHeight: 1.55 },
    heroActions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 },
    primaryButton: { border: 'none', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
    secondaryButton: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, padding: '12px 16px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
    compactButton: { border: 'none', background: secondaryColor, color: '#fff', padding: '12px 14px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 },
    metric: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 16, display: 'grid', gap: 8 },
    searchBand: { background: '#fff', borderRadius: 8, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
    searchHeader: { padding: '24px 24px 0' },
    searchGrid: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18, padding: 24 },
    sectionTitle: { margin: 0, fontSize: 28, lineHeight: 1.15, fontWeight: 800 },
    muted: { margin: '8px 0 0', color: '#55727b', lineHeight: 1.5 },
    panel: { background: '#f5fbfc', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 18, display: 'grid', gap: 14 },
    textarea: { minHeight: 132, border: '1px solid rgba(16,36,46,0.14)', borderRadius: 8, padding: 12, font: 'inherit' },
    inputRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 10 },
    input: { border: '1px solid rgba(16,36,46,0.14)', borderRadius: 8, padding: 12, font: 'inherit', width: '100%' },
    chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
    chip: { border: '1px solid rgba(16,36,46,0.14)', background: '#fff', color: accentTextColor, borderRadius: 999, padding: '8px 11px', fontWeight: 700, cursor: 'pointer' },
    chipActive: { borderColor: 'transparent', background: secondaryColor, color: '#fff' },
    twoColumn: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 },
    workflow: { display: 'grid', gap: 10 },
    workflowStep: { display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: 10, alignItems: 'start', padding: 12, background: '#fff', borderRadius: 8, border: '1px solid rgba(16,36,46,0.08)' },
    resultsLayout: { display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) 360px', gap: 20 },
    resultsPanel: { background: '#fff', borderRadius: 8, padding: 22, boxShadow: '0 16px 34px rgba(15,23,42,0.07)' },
    resultList: { display: 'grid', gap: 14, marginTop: 18 },
    cvCard: { border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 18, background: '#fdfefe' },
    cvTop: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
    candidateId: { display: 'inline-block', background: 'rgba(39,194,198,0.12)', color: secondaryColor, borderRadius: 999, padding: '7px 10px', fontWeight: 800, fontSize: 12 },
    cardTitle: { margin: '10px 0 0', fontSize: 24, lineHeight: 1.15 },
    scoreBox: { minWidth: 96, textAlign: 'right', background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 12 },
    profileSummary: { margin: '12px 0', color: '#55727b', lineHeight: 1.5 },
    skillPills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
    skillPill: { background: '#fff', border: '1px solid rgba(16,36,46,0.08)', borderRadius: 999, padding: '6px 9px', fontSize: 12, fontWeight: 700 },
    cardActions: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 },
    asideStack: { display: 'grid', gap: 18, alignContent: 'start' },
    planList: { display: 'grid', gap: 12, marginTop: 16 },
    plan: { border: '1px solid rgba(16,36,46,0.08)', borderRadius: 8, padding: 16, background: '#fdfefe' },
    featuredPlan: { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', borderColor: 'transparent' },
    planTitle: { margin: 0, fontSize: 21 },
    planCopy: { margin: '8px 0', lineHeight: 1.45 },
    price: { display: 'block', fontSize: 30, margin: '10px 0' },
    featureList: { margin: 0, paddingLeft: 18, lineHeight: 1.7 }
  };
}
