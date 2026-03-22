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
    <div>
      <div>Job: {props.jobId}</div>
      <div>Status: {props.status || 'queued'}</div>
      <div>Progress: {props.progress || 0}%</div>
      {props.errorMessage ? <div>Error: {props.errorMessage}</div> : null}
    </div>
  );
}
