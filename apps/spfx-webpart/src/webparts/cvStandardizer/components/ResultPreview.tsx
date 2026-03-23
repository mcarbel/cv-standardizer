import * as React from 'react';

interface ResultPreviewProps {
  apiBaseUrl: string;
  resultUrl?: string;
  jsonUrl?: string;
}

export default function ResultPreview({ apiBaseUrl, resultUrl, jsonUrl }: ResultPreviewProps): JSX.Element {
  if (!resultUrl && !jsonUrl) {
    return <div>Result will appear here when processing finishes.</div>;
  }

  const resolvedResultUrl = resolveApiUrl(apiBaseUrl, resultUrl);
  const resolvedJsonUrl = resolveApiUrl(apiBaseUrl, jsonUrl);

  return (
    <div style={styles.panel}>
      {resolvedResultUrl ? <div><a href={resolvedResultUrl} target="_blank" rel="noreferrer">Download output</a></div> : null}
      {resolvedJsonUrl ? <div><a href={resolvedJsonUrl} target="_blank" rel="noreferrer">Download JSON</a></div> : null}
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
  }
};

function resolveApiUrl(apiBaseUrl: string, value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedBase = apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${normalizedBase}${normalizedPath}`;
}
