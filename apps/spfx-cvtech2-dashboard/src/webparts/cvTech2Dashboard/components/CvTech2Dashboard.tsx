import * as React from 'react';
import type { ICvTech2DashboardWebPartProps } from '../CvTech2DashboardWebPart';

interface ICard {
  icon: string;
  value: string;
  title: string;
  subtitle?: string;
  accent?: 'light' | 'primary';
}

interface Props {
  webPartProps: ICvTech2DashboardWebPartProps;
}

const metricCards: ICard[] = [
  { icon: 'CHAT', value: '0', title: 'Opened jobs' },
  { icon: 'CASE', value: '0', title: 'Filled jobs' },
  { icon: 'IN', value: '0', title: 'Started missions' },
  { icon: 'OUT', value: '0', title: 'Ending missions', subtitle: 'In the next 3 months' },
  { icon: 'LIVE', value: '0', title: 'Active missions' },
  { icon: 'EUR', value: '-', title: 'Daily rate range' },
  { icon: 'DAYS', value: '0', title: 'Worked days' },
  { icon: 'INV', value: '0 EUR', title: 'Estimated invoice', accent: 'primary' }
];

const sidebarLinks = [
  'Dashboard',
  'My profile',
  'Jobs',
  'Simulations',
  'Missions',
  'Leaves',
  'Overtime'
];

export default function CvTech2Dashboard({ webPartProps }: Props): JSX.Element {
  const {
    brandLabel,
    greetingName,
    profileInitials,
    overviewLabel,
    languagePrimary,
    languageSecondary,
    primaryColor,
    secondaryColor,
    accentTextColor,
    surfaceColor
  } = webPartProps;

  const styles: Record<string, React.CSSProperties> = {
    shell: {
      display: 'grid',
      gridTemplateColumns: '320px minmax(0, 1fr)',
      minHeight: '980px',
      background: surfaceColor,
      color: accentTextColor,
      borderRadius: '28px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(15,23,42,0.10)',
      fontFamily: '"Aptos", "Segoe UI", sans-serif'
    },
    sidebar: {
      background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff',
      padding: '36px 22px 28px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    brand: {
      fontSize: '42px',
      lineHeight: 1,
      fontWeight: 800,
      letterSpacing: '-0.04em',
      textTransform: 'lowercase'
    },
    navCard: {
      borderRadius: '18px',
      padding: '16px 18px',
      background: 'rgba(255,255,255,0.16)',
      fontSize: '22px',
      fontWeight: 700
    },
    navItem: {
      padding: '12px 16px',
      borderRadius: '14px',
      fontSize: '20px',
      fontWeight: 600
    },
    content: {
      padding: '36px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '20px',
      flexWrap: 'wrap'
    },
    profileRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '22px'
    },
    profileBadge: {
      width: '112px',
      height: '112px',
      borderRadius: '999px',
      background: primaryColor,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      fontWeight: 800
    },
    heading: {
      fontSize: '76px',
      lineHeight: 1,
      margin: 0,
      fontWeight: 800,
      letterSpacing: '-0.04em'
    },
    subheading: {
      fontSize: '26px',
      lineHeight: 1.3,
      fontWeight: 700,
      color: primaryColor,
      margin: '18px 0 0 0'
    },
    notification: {
      width: '78px',
      height: '78px',
      borderRadius: '18px',
      background: '#ffffff',
      boxShadow: '0 18px 36px rgba(15,23,42,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: primaryColor,
      fontSize: '28px',
      fontWeight: 800
    },
    sectionTitle: {
      fontSize: '40px',
      lineHeight: 1.1,
      fontWeight: 800,
      color: primaryColor,
      margin: 0
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '24px'
    },
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      minHeight: '172px',
      padding: '28px',
      boxShadow: '0 14px 34px rgba(15,23,42,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '18px'
    },
    primaryCard: {
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      color: '#ffffff'
    },
    icon: {
      minWidth: '68px',
      height: '68px',
      borderRadius: '18px',
      background: 'rgba(39,194,198,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: secondaryColor,
      fontSize: '14px',
      fontWeight: 800
    },
    iconPrimary: {
      background: 'rgba(255,255,255,0.18)',
      color: '#ffffff'
    },
    cardValue: {
      fontSize: '58px',
      lineHeight: 1,
      fontWeight: 800,
      margin: 0
    },
    cardTitle: {
      fontSize: '22px',
      lineHeight: 1.2,
      fontWeight: 700,
      margin: '10px 0 0 0'
    },
    cardSubtitle: {
      fontSize: '14px',
      lineHeight: 1.5,
      margin: '8px 0 0 0',
      opacity: 0.8
    },
    languageBlock: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    languagePrimary: {
      borderRadius: '14px',
      padding: '14px 18px',
      background: 'rgba(255,255,255,0.18)',
      fontSize: '18px',
      fontWeight: 700
    },
    languageSecondary: {
      padding: '6px 18px',
      fontSize: '18px',
      fontWeight: 600
    }
  };

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>{brandLabel}</div>
        <div style={styles.navCard}>{sidebarLinks[0]}</div>
        {sidebarLinks.slice(1).map((label) => (
          <div key={label} style={styles.navItem}>
            {label}
          </div>
        ))}
        <div style={styles.languageBlock}>
          <div style={styles.languagePrimary}>{languagePrimary}</div>
          <div style={styles.languageSecondary}>{languageSecondary}</div>
        </div>
      </aside>

      <main style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.profileRow}>
              <div style={styles.profileBadge}>{profileInitials}</div>
              <h1 style={styles.heading}>Hello {greetingName}</h1>
            </div>
            <p style={styles.subheading}>{overviewLabel}</p>
          </div>
          <div style={styles.notification}>!</div>
        </div>

        <section>
          <div style={styles.cardsGrid}>
            {metricCards.slice(0, 4).map((card) => {
              const isPrimary = card.accent === 'primary';
              return (
                <div
                  key={card.title}
                  style={{
                    ...styles.card,
                    ...(isPrimary ? styles.primaryCard : {})
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={styles.cardValue}>{card.value}</p>
                    <p style={styles.cardTitle}>{card.title}</p>
                    {card.subtitle ? <p style={styles.cardSubtitle}>{card.subtitle}</p> : null}
                  </div>
                  <div
                    style={{
                      ...styles.icon,
                      ...(isPrimary ? styles.iconPrimary : {})
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Monthly report</h2>
        </section>

        <section>
          <div style={styles.cardsGrid}>
            {metricCards.slice(4).map((card) => {
              const isPrimary = card.accent === 'primary';
              return (
                <div
                  key={card.title}
                  style={{
                    ...styles.card,
                    ...(isPrimary ? styles.primaryCard : {})
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={styles.cardValue}>{card.value}</p>
                    <p style={styles.cardTitle}>{card.title}</p>
                    {card.subtitle ? <p style={styles.cardSubtitle}>{card.subtitle}</p> : null}
                  </div>
                  <div
                    style={{
                      ...styles.icon,
                      ...(isPrimary ? styles.iconPrimary : {})
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
