import * as React from 'react';

export interface DebugEntry {
  id: string;
  time: string;
  stage: string;
  message: string;
  payload?: unknown;
  level?: 'info' | 'error';
}

interface DebugPanelProps {
  entries: DebugEntry[];
  onClear: () => void;
}

export default function DebugPanel({ entries, onClear }: DebugPanelProps): JSX.Element {
  return (
    <section style={styles.panel}>
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.heading}>Debug Console</h3>
          <p style={styles.description}>Client steps and raw backend JSON responses.</p>
        </div>
        <button type="button" style={styles.clearButton} onClick={onClear}>
          Clear
        </button>
      </div>
      {entries.length === 0 ? (
        <div style={styles.emptyState}>No debug events yet.</div>
      ) : (
        <div style={styles.entryList}>
          {entries.map((entry) => (
            <article
              key={entry.id}
              style={{
                ...styles.entry,
                borderColor: entry.level === 'error' ? '#fca5a5' : '#cbd5e1',
                backgroundColor: entry.level === 'error' ? '#fff1f2' : '#f8fafc'
              }}
            >
              <div style={styles.entryMeta}>
                <span style={styles.entryStage}>{entry.stage}</span>
                <span>{entry.time}</span>
              </div>
              <div style={styles.entryMessage}>{entry.message}</div>
              {typeof entry.payload !== 'undefined' ? (
                <pre style={styles.payload}>{JSON.stringify(entry.payload, null, 2)}</pre>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    marginTop: '20px',
    padding: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    backgroundColor: '#ffffff'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  heading: {
    margin: 0
  },
  description: {
    margin: '4px 0 0 0',
    color: '#475569'
  },
  clearButton: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #94a3b8',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  emptyState: {
    color: '#64748b'
  },
  entryList: {
    display: 'grid',
    gap: '12px'
  },
  entry: {
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '12px'
  },
  entryMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    fontSize: '12px',
    color: '#475569',
    marginBottom: '8px'
  },
  entryStage: {
    fontWeight: 700
  },
  entryMessage: {
    marginBottom: '8px',
    color: '#0f172a'
  },
  payload: {
    margin: 0,
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    overflowX: 'auto',
    fontSize: '12px'
  }
};
