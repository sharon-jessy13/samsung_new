import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Button
} from "@mui/material";
import { ArrowBack, Assignment, Description, GetApp, PictureAsPdf } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getHRLetterDetailsByInstanceID } from '../services/apiclient';

export default function ReportState() {
  const { instanceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState(null);

  // ✅ Fetch data for given instanceId
  useEffect(() => {
    if (!instanceId) return;

    const fetchLetterData = async () => {
      try {
        console.log("📋 ReportState: Fetching letter data for instance ID:", instanceId);
        const data = await getHRLetterDetailsByInstanceID(instanceId);
        console.log("✅ ReportState: Letter data received:", data);
        setLetterData(data);
      } catch (error) {
        console.error("❌ ReportState: Error fetching letter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetterData();
  }, [instanceId]);

  if (loading) return <Typography>Loading report...</Typography>;
  if (!letterData) return <Typography>No report data found</Typography>;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 2 }}>
      {/* Header Section */}
      <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          My Workspace &gt; HR Letter &gt; Report
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
          <IconButton size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>
            HR Letter Request - Report
          </Typography>
        </Box>

        {/* Employee Info Header */}
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ width: 48, height: 48 }}>
              {letterData.employeeName?.charAt(0) || 'M'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography fontWeight="bold">
              {letterData.employeeName} • Gen ID: {letterData.genId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {letterData.email}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">Designation</Typography>
            <Typography fontWeight="bold">{letterData.designation}</Typography>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">Division</Typography>
            <Typography fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
              {letterData.division}
            </Typography>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" flexItem />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">Manager</Typography>
            <Typography fontWeight="bold">{letterData.manager}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Required Information Section */}
      <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assignment sx={{ color: '#1976d2', mr: 1 }} />
          <Typography fontWeight="bold">Required Information</Typography>
        </Box>

        {/* Proof Details */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Proof Details
        </Typography>

        <Grid container spacing={3}>
          {/* Type of Letter Required */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Type of Letter Required
            </Typography>
            <TextField
              fullWidth
              value={letterData.letterType}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
            />
          </Grid>

          {/* Address Proof specific fields */}
          {letterData.letterType === 'Address Proof' && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Personal Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Permanent Address
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.permanentAddress}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Current Address
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.currentAddress}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Letter required for Permanent or Current Address
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.ltrReqOnCuOrPeAdd}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          )}

          {/* Office Correspondence Letter specific fields */}
          {letterData.letterType === 'Office Correspondence Letter' && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Office Address of Correspondence
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={letterData.offAddOfCorrespondance}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
          )}

          {/* No Objection Certificate specific fields */}
          {letterData.letterType === 'No Objection Certificate' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Leave From
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.noc_LeaveFrom}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Leave To
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.noc_LeaveTo}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              {/* Attachment section for NOC in ReportState */}
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Attachment
                </Typography>
                {letterData.attachment ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    backgroundColor: '#fafafa'
                  }}>
                    <PictureAsPdf sx={{ color: '#d32f2f', mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {letterData.attachmentName || 'Fitness Certificate.pdf'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {letterData.attachmentDate || '11 Sep, 2023'} • {letterData.attachmentSize || '2.24pm'} • {letterData.attachmentFileSize || '2.5MB'}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = letterData.attachmentUrl || letterData.attachmentPath || '#';
                        link.download = letterData.attachmentName || 'attachment.pdf';
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      title="Download attachment"
                    >
                      <GetApp />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attachment provided
                  </Typography>
                )}
              </Grid>
            </>
          )}

          {/* Letter required for Reason */}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Letter required for Reason
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={letterData.reason}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      {/* View Policies Section */}
      <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ color: '#666', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            View Policies
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}