import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GetAppIcon from '@mui/icons-material/GetApp';

// Accept workflowState as a prop
function NOC({ workflowState }) {
  
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile({
        name: uploadedFile.name,
        size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB`,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fileObject: uploadedFile,
        url: URL.createObjectURL(uploadedFile),
      });
    }
  };

  const handleFileDelete = () => {
    if (file && file.url) {
      URL.revokeObjectURL(file.url);
    }
    setFile(null);
  };

  const isViewMode = workflowState === 'Approval' || workflowState === 'Report';

  return (
    <>
      
      <Box className="noc-attachment-section" sx={{ mt: 2 }}>
        <Typography variant="body2" className="label" sx={{ mb: 1 }} marginLeft={3}>Attachment</Typography>
        <Box className="noc-attachment-box" sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 2,
          flexDirection: 'column',
          gap: 1,
          maxWidth:450,
          marginLeft:3,
        }}>
          {isViewMode ? (
            
            file ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <PictureAsPdfIcon sx={{ color: '#E53935', fontSize: 40 }} />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#757575' }}>
                    {file.date} | {file.time} • {file.size}
                  </Typography>
                </Box>

                {file.url && (
                  <IconButton
                    component="a"
                    href={file.url}
                    download={file.name}
                    aria-label="download file"
                    sx={{ color: '#E53935' }}
                  >
                    <GetAppIcon />
                  </IconButton>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No file uploaded</Typography>
            )
          ) : (
           
            <>
              <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleUploadClick}
                  startIcon={<span role="img" aria-label="clip">📎</span>}
                >
                  Choose a File
                </Button>
                <Typography variant="caption" className="noc-upload-info">PDF format • Max. 4MB</Typography>
              </Box>

              {file && (
                <Box className="noc-file-preview" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  border: '1px solid #eee',
                  borderRadius: 1,
                  p: 1,
                  mt: 1,
                  backgroundColor: '#f9f9f9'
                }}>
                  <Typography variant="body2" className="noc-file-type" sx={{ fontWeight: 'bold' }}>PDF</Typography>
                  <Typography variant="body2" className="noc-file-name" sx={{ flexGrow: 1 }}>{file.name}</Typography>
                  <Typography variant="caption" className="noc-file-meta">{file.date} • {file.time} • {file.size}</Typography>
                  <Button
                    onClick={handleFileDelete}
                    title="Delete"
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <span role="img" aria-label="delete">🗑️</span>
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
export default NOC;