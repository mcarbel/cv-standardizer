import * as React from 'react';

interface JobStatusPanelProps {
  jobId?: string;
  status?: string;
  progress?: number;
  errorMessage?: string;
}

export default function JobStatusPanel(props: JobStatusPanelProps): JSX.Element {
  if (!props.jobId) {
    return <div>No job started yet.</div>;
  }

  return (
    <div style={styles.panel}>
      <div>Job: {props.jobId}</div>
      <div>Status: {props.status || 'queued'}</div>
      <div>Progress: {props.progress || 0}%</div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${props.progress || 0}%` }} />
      </div>
      {props.errorMessage ? <div>Error: {props.errorMessage}</div> : null}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    marginTop: '16px',
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    backgroundColor: '#f8fafc'
  },
  progressTrack: {
    marginTop: '8px',
    width: '100%',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: '#0f62fe',
    transition: 'width 0.3s ease'
  }
};
