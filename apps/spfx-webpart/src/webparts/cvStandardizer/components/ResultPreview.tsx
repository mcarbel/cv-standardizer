import * as React from 'react';

interface ResultPreviewProps {
  resultUrl?: string;
  jsonUrl?: string;
}

export default function ResultPreview({ resultUrl, jsonUrl }: ResultPreviewProps): JSX.Element {
  if (!resultUrl && !jsonUrl) {
    return <div>Result will appear here when processing finishes.</div>;
  }

  return (
    <div>
      {resultUrl ? <div><a href={resultUrl}>Download output</a></div> : null}
      {jsonUrl ? <div><a href={jsonUrl}>Download JSON</a></div> : null}
    </div>
  );
}
