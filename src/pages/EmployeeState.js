import React, {useState, useEffect} from 'react';
import '../styles/EmployeeState.css'
import {
  Box,
  Typography,
  TextareaAutosize,
  Button,
  Link,
  Select,
  MenuItem,
  FormControl,
  Grid,
  TextField
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useProofDetailsForm from '../Hooks/useProofDetailsForm';
import { getLetterTypes, getEmpResourceType } from '../services/apiclient';


import AddressProof from '../components/AddressProof'
import NOC from '../components/NOC';
import OfficeCorrespondence from '../components/OfficeCorrespondence';


function EmployeeState({instanceId, workflowState, setWorkflowState, onSubmit }) {
 
  const [letterTypes, setLetterTypes] = React.useState([]);
  React.useEffect(() => {
  async function fetchLetterTypes() {
    try {
      const data = await getLetterTypes();
      setLetterTypes(data);
    } catch (error) {
      console.error("Failed to fetch letter types:", error);
    }
  }
  fetchLetterTypes();
},[setLetterTypes]);

 const {
  letterType,
  isSubmitted,
  reason,
  comment,
  nocFromDate,
  nocToDate,
  isViewMode,
  showCommentSection,
  handleLetterTypeChange,
  handleSubmit,
  handleApproveClick,
  setReason,
  setComment,
  setNocFromDate,
  setNocToDate,
  showActionButtons,
  permanentAddress,
  setPermanentAddress,
  currentAddress,
  setCurrentAddress,
  addressType,
  setAddressType,
  employee,
  mempId,
  setMempId,
  hasAccess,
  isCheckingAccess,
  accessChecked,
  handleCheckAccess,
} = useProofDetailsForm({ instanceId, onSubmit});

const [resourceType, setResourceType] = useState(null);
  const [loading, setLoading] = useState(true);

  // Employee data for API calls - will be populated after user enters Employee ID
  const employeeData = {
    mEmpID: mempId ? parseInt(mempId) : null, // Use user-entered Employee ID
    name: "", // Will be fetched from API after access check
    genId: ""
  };

  useEffect(() => {
    // Only make API call if Employee ID is available (after user enters it)
    if (employeeData?.mEmpID) {
      console.log("📞 Calling getEmpResourceType API with ID:", employeeData.mEmpID);
      setLoading(true);
      getEmpResourceType(employeeData.mEmpID)
        .then((type) => {
          console.log("✅ API Response - Resource Type:", type);
          setResourceType(type); // type will be 1 or 0
        })
        .catch((error) => {
          console.error("❌ API Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No Employee ID yet - this is expected before user enters it
      setLoading(false);
    }
  }, [employeeData?.mEmpID]);

  

  // Show loading state while checking access
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>🔄 Checking Access...</h3>
        <p>Verifying your eligibility to request a letter...</p>
        <p><strong>Debug Info:</strong> Employee ID: {employee?.mEmpID || 'Not found'}</p>
      </div>
    );
  }

  // Show access denied if resourceType is 0
  if (resourceType === 0) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>❌ Access Denied</h3>
        <p>You are not eligible to request a letter.</p>
        <p><strong>Debug Info:</strong> Resource Type: {resourceType}</p>
      </div>
    );
  }

  // Show access granted info if resourceType is 1
  if (resourceType === 1) {
    console.log("✅ Access granted - showing form");
  }
  return (
    <Box className="proof-details-container">
      <Box className="proof-header">
        <Typography component="h2" className="proof-header-title">Proof Details</Typography>
        <Box className="proof-note">
          <InsertDriveFileIcon className="note-icon" />
          <Typography className="note-text">Note</Typography>
        </Box>
      </Box>

      {/* Step 1: Employee ID Entry and Access Check */}
      {!hasAccess && (
        <Box className="form-section">
          <Typography variant="h6" className="section-title">
            Employee Authentication
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography className="label">Employee ID *</Typography>
              <TextField
                fullWidth
                required
                placeholder="Enter your Employee ID"
                value={mempId}
                onChange={(e) => setMempId(e.target.value)}
                className="input-field"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} style={{display: 'flex', alignItems: 'end'}}>
              <Button
                variant="contained"
                onClick={handleCheckAccess}
                disabled={!mempId || isCheckingAccess}
                className="check-access-button"
              >
                {isCheckingAccess ? "Checking Access..." : "Check Access"}
              </Button>
            </Grid>
          </Grid>
          
          {accessChecked && !hasAccess && (
            <Typography color="error" style={{marginTop: '10px'}}>
              ❌ Access denied. Please contact HR if you believe this is an error.
            </Typography>
          )}
        </Box>
      )}

      {/* Step 2: HR Letter Request Form - Only show if access is granted */}
      {hasAccess && (
        <form onSubmit={handleSubmit}>
          <Box className="form-section">
          <Grid container spacing={2} className="letter-grid">

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography className="label">Type of Letter Required</Typography>
                <Select
                  value={letterType}
                  onChange={handleLetterTypeChange}
                  className="select-box"
                  disabled={isViewMode}
                >
    
                  {letterTypes.map((type) => (
                    <MenuItem key={type.lkeyvalue} value={type.letterType}>
                      {type.letterType}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>
            </Grid>


            {letterType === 'No Objection Certificate' && (
              <Grid item xs={12} sm={4}> 
                <Typography className="label">Leave From</Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={nocFromDate}
                  onChange={(e) => setNocFromDate(e.target.value)}
                  className="select-box"
                  InputLabelProps={{ shrink: true }}
                  disabled={isViewMode}
                />
              </Grid>
            )}


            {letterType === 'No Objection Certificate' && (
              <Grid item xs={12} sm={4}> {/* Adjusted size */}
                <Typography className="label">Leave To</Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={nocToDate}
                  onChange={(e) => setNocToDate(e.target.value)}
                  className="select-box"
                  InputLabelProps={{ shrink: true }}
                  disabled={isViewMode}
                />
              </Grid>
            )}
          </Grid>
        </Box>

        {letterType === 'Address Proof'  && <AddressProof />}
        {letterType === 'No Objection Certificate' && <NOC/>}
        {letterType === 'Office Correspondence Letter' && <OfficeCorrespondence />}

        <Box className="form-section">
          <Typography className="label">Letter required for (Reason)</Typography>
          <TextareaAutosize
            required
            minRows={3}
            placeholder="XXX-XXX-XX-XXXX-X"
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Box>

        
          <Box className="form-section">
            <Typography className="label">Comment (Max 500 Chars)</Typography>
            <TextareaAutosize
              minRows={5}
              maxRows={10}
              placeholder="Enter your comment here..."
              maxLength={500}
              className="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isViewMode}
            />
          </Box>
        


        
          <Box className="form-submit">
            <Button variant="contained" type="submit" className="submit-button" >
              Submit
            </Button>
          </Box>
        
        </form>
      )}

      <Box className="view-policies">
        <DescriptionOutlinedIcon className="policy-icon" />
        <Link href="#" underline="hover" color="textSecondary">
          <Typography variant="body2">View Policies</Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default EmployeeState;