import * as React from 'react';

interface UploadPanelProps {
  onUpload: (file: File) => Promise<void>;
}

export default function UploadPanel({ onUpload }: UploadPanelProps): JSX.Element {
  const [busy, setBusy] = React.useState(false);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor="cv-upload">Upload CV</label>
      <input id="cv-upload" type="file" accept=".pdf,.docx,.txt" onChange={onChange} disabled={busy} />
    </div>
  );
}
