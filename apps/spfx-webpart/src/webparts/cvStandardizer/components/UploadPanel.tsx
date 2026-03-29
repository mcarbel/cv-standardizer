import * as React from 'react';

interface UploadPanelProps {
  onUpload: (file: File) => Promise<void>;
}

const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.docx'];

export default function UploadPanel({ onUpload }: UploadPanelProps): JSX.Element {
  const [busy, setBusy] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  async function processFile(file: File | undefined): Promise<void> {
    if (!file) {
      return;
    }

    if (!isSupportedFile(file)) {
      setErrorMessage('Only PDF and DOCX files are supported for drag and drop upload.');
      return;
    }

    setErrorMessage(undefined);
    setBusy(true);

    try {
      await onUpload(file);
    } finally {
      setBusy(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  async function onChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    await processFile(event.target.files?.[0]);
  }

  async function onDrop(event: React.DragEvent<HTMLDivElement>): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    await processFile(file);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }

  return (
    <div
      style={{
        ...styles.dropZone,
        ...(dragActive ? styles.dropZoneActive : undefined),
        ...(busy ? styles.dropZoneBusy : undefined)
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        id="cv-upload"
        type="file"
        accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
        onChange={onChange}
        disabled={busy}
        style={styles.hiddenInput}
      />
      <div style={styles.badge}>Upload from device</div>
      <div style={styles.content}>
        <div style={styles.iconCircle}>+</div>
        <div style={styles.copyBlock}>
          <h3 style={styles.title}>Upload CVs to be analyzed</h3>
          <p style={styles.subtitle}>
            Drag and drop a PDF or DOCX here, or click to choose a file from your device.
          </p>
          <p style={styles.helper}>
            Supported formats: {ACCEPTED_FILE_EXTENSIONS.join(', ').replace(/\./g, '').toUpperCase()}
          </p>
        </div>
      </div>
      <div style={styles.actions}>
        <button type="button" style={styles.primaryButton} disabled={busy}>
          {busy ? 'Uploading...' : 'Choose file'}
        </button>
      </div>
      {errorMessage ? <p style={styles.errorText}>{errorMessage}</p> : null}
    </div>
  );
}

function isSupportedFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

const styles: { [key: string]: React.CSSProperties } = {
  dropZone: {
    width: '100%',
    maxWidth: '980px',
    minHeight: '340px',
    borderRadius: '32px',
    border: '1.5px dashed rgba(37, 99, 235, 0.28)',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    boxShadow: '0 28px 70px rgba(15, 23, 42, 0.14)',
    backdropFilter: 'blur(18px)',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease'
  },
  dropZoneActive: {
    transform: 'translateY(-2px)',
    borderColor: '#2563eb',
    boxShadow: '0 32px 90px rgba(37, 99, 235, 0.22)'
  },
  dropZoneBusy: {
    opacity: 0.8,
    cursor: 'progress'
  },
  hiddenInput: {
    display: 'none'
  },
  badge: {
    alignSelf: 'flex-start',
    padding: '12px 18px',
    borderRadius: '18px',
    backgroundColor: '#ffffff',
    color: '#1e3a8a',
    fontSize: '16px',
    fontWeight: 700,
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.1)'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '22px',
    textAlign: 'center',
    padding: '24px 12px'
  },
  iconCircle: {
    width: '88px',
    height: '88px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '42px',
    lineHeight: 1,
    color: '#1d4ed8',
    background: 'linear-gradient(145deg, rgba(219, 234, 254, 0.94), rgba(255, 255, 255, 0.98))',
    boxShadow: '0 18px 30px rgba(37, 99, 235, 0.18)'
  },
  copyBlock: {
    maxWidth: '700px'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: 'clamp(30px, 4vw, 52px)',
    lineHeight: 1.08,
    color: '#0f3d78',
    fontWeight: 800,
    letterSpacing: '-0.03em'
  },
  subtitle: {
    margin: '0 0 10px 0',
    fontSize: '19px',
    lineHeight: 1.6,
    color: '#334155'
  },
  helper: {
    margin: 0,
    color: '#64748b',
    fontSize: '14px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  primaryButton: {
    padding: '16px 26px',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #0f3d78, #2563eb)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 18px 28px rgba(37, 99, 235, 0.24)'
  },
  errorText: {
    margin: '16px 0 0 0',
    color: '#b91c1c',
    fontWeight: 600,
    textAlign: 'center'
  }
};
