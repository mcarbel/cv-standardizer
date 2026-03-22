import * as React from 'react';
import type { ICvStandardizerWebPartProps } from '../models/IWebPartProps';
import type { JobRecord } from '../models/ApiModels';
import { ApiClient } from '../services/ApiClient';
import JobStatusPanel from './JobStatusPanel';
import ResultPreview from './ResultPreview';
import UploadPanel from './UploadPanel';

interface Props {
  webPartProps: ICvStandardizerWebPartProps;
}

export default function CvStandardizerApp({ webPartProps }: Props): JSX.Element {
  const client = React.useMemo(() => new ApiClient(webPartProps.apiBaseUrl), [webPartProps.apiBaseUrl]);
  const [job, setJob] = React.useState<JobRecord | undefined>();

  async function handleUpload(file: File): Promise<void> {
    const created = await client.createJob(file, {
      provider: webPartProps.defaultProvider,
      model: webPartProps.defaultModel,
      outputFormat: webPartProps.outputFormat,
      providerBaseUrl: webPartProps.providerBaseUrl,
      apiKey: webPartProps.apiKey,
      dumpJson: webPartProps.dumpJson
    });

    setJob({
      jobId: created.jobId,
      status: created.status,
      progress: 0
    });
  }

  React.useEffect(() => {
    if (!job?.jobId || job.status === 'completed' || job.status === 'failed') {
      return;
    }

    const timer = window.setInterval(async () => {
      const next = await client.getJob(job.jobId);
      setJob(next);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [client, job]);

  return (
    <section>
      <h2>CV Standardizer</h2>
      <p>Provider: {webPartProps.defaultProvider}</p>
      <p>Model: {webPartProps.defaultModel}</p>
      <p>API URL: {webPartProps.apiBaseUrl}</p>
      <UploadPanel onUpload={handleUpload} />
      <JobStatusPanel
        jobId={job?.jobId}
        status={job?.status}
        progress={job?.progress}
        errorMessage={job?.errorMessage}
      />
      <ResultPreview resultUrl={job?.outputDownloadUrl} jsonUrl={job?.jsonDownloadUrl} />
    </section>
  );
}
