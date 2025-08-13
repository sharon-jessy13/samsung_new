import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Container
} from "@mui/material";
import { ArrowBack, Assignment, SwapHoriz, Description, GetApp, PictureAsPdf } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getHRLetterDetailsByInstanceID } from '../services/apiclient';

// Normalize API response keys to the camelCase names used by the UI
function normalizeLetterData(d = {}) {
  if (!d) return null;
  const n = {
    // Header/Employee
    employeeName: d.employeeName || d.empName || d.EmployeeName || d.EmpName || '',
    genId: d.genId || d.GenId || d.generalId || d.GeneralId || '',
    email: d.email || d.emailId || d.Email || d.EmailId || '',
    designation: d.designation || d.Designation || '',
    division: d.division || d.Division || '',
    manager: d.manager || d.Manager || d.managerName || d.ManagerName || '',

    // Core fields
    letterType: d.letterType || d.LetterType || '',
    reason: d.reason || d.Reason || '',
    comment: d.comment || d.Comment || '',

    // Address Proof
    permanentAddress: d.permanentAddress || d.PermanentAddress || '',
    currentAddress: d.currentAddress || d.CurrentAddress || '',
    ltrReqOnCuOrPeAdd: d.ltrReqOnCuOrPeAdd || d.LtrReqOnCuOrPeAdd || d.letterRequiredOn || d.LetterRequiredOn || '',

    // Copies
    numberOfCopies: d.numberOfCopies ?? d.noOfCopies ?? d.copies ?? d.NoOfCopies ?? '',

    // Office Correspondence
    offAddOfCorrespondance: d.offAddOfCorrespondance || d.officeAddressOfCorrespondence || d.OfficeAddressOfCorrespondence || '',

    // NOC
    noc_LeaveFrom: d.noc_LeaveFrom || d.nocLeaveFrom || d.NOC_LeaveFrom || d.NOCLeaveFrom || '',
    noc_LeaveTo: d.noc_LeaveTo || d.nocLeaveTo || d.NOC_LeaveTo || d.NOCLeaveTo || '',

    // Attachment
    attachment: d.attachment || d.Attachment || null,
    attachmentName: d.attachmentName || d.AttachmentName || '',
    attachmentUrl: d.attachmentUrl || d.attachmentPath || d.AttachmentUrl || d.AttachmentPath || '',
    attachmentDate: d.attachmentDate || d.AttachmentDate || '',
    attachmentFileSize: d.attachmentFileSize || d.AttachmentFileSize || '',
  };
  return n;
}

function ApproveState() {
  const { instanceId } = useParams();
  // Normalize instanceId to digits only (guards against ":123" or stray characters)
  const cleanedInstanceId = String(instanceId || '')
    .trim()
    .replace(/\D/g, '');
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch data for given instanceId
  useEffect(() => {
    if (!cleanedInstanceId) {
      console.log("⚠️ No instance ID provided");
      setLoading(false);
      return;
    }

    const fetchLetterData = async () => {
      try {
        if (cleanedInstanceId !== String(instanceId)) {
          console.warn("⚠️ Route instanceId contained non-digits, using cleaned ID:", cleanedInstanceId);
        }
        console.log("📋 Fetching letter data for instance ID:", cleanedInstanceId);
        const data = await getHRLetterDetailsByInstanceID(cleanedInstanceId);
        console.log("✅ Letter data received:", data);

        // Normalize keys so UI bindings work even if API changes casing/names
        const normalized = normalizeLetterData(data);
        if (normalized) {
          setLetterData(normalized);
        } else {
          console.error("❌ No valid data found for instance ID:", cleanedInstanceId);
          setLetterData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching letter data:", error);
        
        // Handle specific error cases
        if (error.message.includes('400')) {
          console.error("❌ Instance ID not found or invalid:", cleanedInstanceId);
        }
        
        setLetterData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLetterData();
  }, [cleanedInstanceId]);

  // ✅ Handle Approve / Reject / Restart actions (without API call)
  const handleAction = (status) => {
    try {
      console.log(`📋 Action taken: ${status} for instance ID: ${instanceId}`);
      
      // Update local state to reflect the action
      if (letterData) {
        setLetterData({
          ...letterData,
          status: status,
          actionDate: new Date().toISOString(),
          actionBy: 'Manager'
        });
      }

      // Show success message
      alert(`✅ Request ${status} successfully!`);
      
      // Navigate to report state after approval
      if (status === 'Approve') {
        setTimeout(() => {
          navigate(`/report/${instanceId}`);
        }, 1000);
      }
      
    } catch (error) {
      console.error("❌ Error handling action:", error);
      alert("Failed to process action. Please try again.");
    }
  };

  // ✅ Download attachment file (direct download without API)
  const handleDownloadAttachment = () => {
    try {
      if (!letterData.attachmentUrl && !letterData.attachmentName) {
        alert("No attachment available for download");
        return;
      }

      // Direct file download using the file URL stored in letterData
      const link = document.createElement('a');
      link.href = letterData.attachmentUrl || letterData.attachmentPath || '#';
      link.download = letterData.attachmentName || 'attachment.pdf';
      link.target = '_blank'; // Open in new tab if direct download fails
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Attachment download initiated:", letterData.attachmentName);
    } catch (error) {
      console.error("❌ Error downloading attachment:", error);
      alert("Failed to download attachment. Please try again.");
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Typography variant="h6">Loading letter details...</Typography>
    </Box>
  );
  
  if (!letterData) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', p: 4 }}>
      <Typography variant="h5" color="error" gutterBottom>
        ❌ Letter Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center">
        No letter data found for Instance ID: <strong>{cleanedInstanceId || instanceId}</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
        This could mean:
      </Typography>
      <ul style={{ textAlign: 'left', marginTop: '8px' }}>
        <li>The instance ID is invalid or doesn't exist</li>
        <li>The letter request hasn't been submitted yet</li>
        <li>There was an error in the submission process</li>
      </ul>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
        Please check the instance ID and try again, or submit a new letter request.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ backgroundColor: 'white', p: 2.5, borderRadius: 2, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          My Workspace &gt; HR Letter
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
          <IconButton size="small" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>
            HR Letter Request - (HR Approval)
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
      <Box sx={{ backgroundColor: 'white', p: 2.5, borderRadius: 2, mb: 2 }}>
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

          {/* Conditional fields based on letter type */}
          {letterData.letterType === 'Address Proof' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Personal Details
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Permanent Address
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.permanentAddress}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Current Address
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.currentAddress}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
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
                Office Address of Correspondence(Use ',' for separation)
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
                  Leave From *
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
                  Leave To *
                </Typography>
                <TextField
                  fullWidth
                  value={letterData.noc_LeaveTo}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              {/* Attachment section for NOC */}
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
                      onClick={handleDownloadAttachment}
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
          <Grid item xs={12} md={12}>
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

          {/* Number of Copies removed */}

          {/* Comment */}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Comment (Max 500 Chars)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={letterData.comment}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleAction("Restart")}
            sx={{ textTransform: 'none' }}
          >
            Restart
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleAction("Reject")}
            sx={{ textTransform: 'none' }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAction("Approve")}
            sx={{ 
              backgroundColor: '#1976d2',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Approval
          </Button>
        </Box>
      </Box>

      {/* Transfer Workflow Section */}
      <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SwapHoriz sx={{ color: '#1976d2', mr: 1 }} />
            <Typography fontWeight="bold">Transfer Workflow</Typography>
          </Box>
          <IconButton 
            size="small"
            onClick={() => navigate(`/report/${instanceId}`)}
            title="Go to Report State"
          >
            <ArrowBack sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: 'white', p: 2.5, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ color: '#666', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            View Policies
          </Typography>
        </Box>
      </Box>
      </Container>
    </Box>
  );
}
export default ApproveState;
