// DocumentViewer.tsx
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
interface DocumentViewerProps {
  url: string;
  title?: string;
  download?: boolean;
}

const AdvanceDocumentViewer = ({ url, title, download = false }: DocumentViewerProps) => {
  const getFileType = (): string => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'other';
  };

  const fileType = getFileType();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
      }}
    >
      {fileType === 'image' && (
        <>
          <img
            src={url}
            alt={title || 'Document'}
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              objectFit: 'contain',
            }}
          />
          {download && <DownloadButton url={url} label="Download" />}
        </>
      )}

      {fileType === 'pdf' && (
        <>
          <iframe
            src={`${url}#view=fitH`}
            style={{
              width: '100%',
              height: '200px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
            title={title || 'PDF Document'}
          />
          {download && <DownloadButton url={url} label="Download PDF" />}
        </>
      )}

      {fileType === 'other' && (
        <>
          <div
            style={{
              width: '100%',
              padding: '20px',
              border: '1px dashed #e0e0e0',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#fafafa',
            }}
          >
            <DescriptionIcon style={{ fontSize: '2rem', color: '#757575' }} />
            <span style={{ fontSize: '0.875rem', color: '#616161' }}>
              {url.split('.').pop()?.toUpperCase()} File
            </span>
          </div>
          {download && (
            <DownloadButton url={url} label={`Download ${url.split('.').pop()?.toUpperCase()}`} />
          )}
        </>
      )}
    </div>
  );
};


const DownloadButton = ({ url, label }: { url: string; label: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      color: '#1976d2',
      textDecoration: 'none',
      fontSize: '0.875rem',
      padding: '4px 8px',
      borderRadius: '4px',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(25, 118, 210, 0.04)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
    }}
  >
    <FileDownloadIcon style={{ fontSize: '1rem' }} />
    {label}
  </a>
);

export default AdvanceDocumentViewer;