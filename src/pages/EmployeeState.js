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

 const {
  letterTypes,
  letterType,
  setLetterType,
  letterTypeKey,
  setLetterTypeKey,
  addressType,
  setAddressType,
  reason,
  setReason,
  comment,
  setComment,
  permanentAddress,
  setPermanentAddress,
  currentAddress,
  setCurrentAddress,
  nocFromDate,
  setNocFromDate,
  nocToDate,
  setNocToDate,
  numberOfCopies,
  setNumberOfCopies,
  officeAddress,
  setOfficeAddress,
  placeOfTravel,
  setPlaceOfTravel,
  mempId,
  setMempId,
  hasAccess,
  isCheckingAccess,
  accessChecked,
  handleCheckAccess,
  isSubmitting,
  handleLetterTypeChange,
  handleSubmit,
} = useProofDetailsForm({ instanceId, onSubmit});

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
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '');
                  // Treat '0' as invalid (clear it) and remove leading zeros
                  if (digitsOnly === '0') {
                    setMempId('');
                  } else {
                    const normalized = digitsOnly.replace(/^0+/, '');
                    setMempId(normalized);
                  }
                }}
                className="input-field"
                type="text"
                autoComplete='off'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} style={{display: 'flex', alignItems: 'end'}}>
              <Button
                variant="contained"
                onClick={handleCheckAccess}
                disabled={!mempId || mempId === '0' || isCheckingAccess}
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

                />
              </Grid>
            )}
          </Grid>
        </Box>

        {letterType === 'Address Proof'  && (
          <AddressProof 
            permanentAddress={permanentAddress}
            setPermanentAddress={setPermanentAddress}
            currentAddress={currentAddress}
            setCurrentAddress={setCurrentAddress}
            addressType={addressType}
            setAddressType={setAddressType}
          />
        )}
        {letterType === 'No Objection Certificate' && <NOC/>}
        {letterType === 'Office Correspondence Letter' && (
          <OfficeCorrespondence 
            officeAddress={officeAddress}
            setOfficeAddress={setOfficeAddress}
          />
        )}

        {/* Additional fields for specific letter types */}
        {letterType === 'Office Correspondence Letter' && (
          <Box className="form-section">
            <Typography className="label">Place of Travel</Typography>
            <TextField
              fullWidth
              placeholder="Enter place of travel"
              value={placeOfTravel}
              onChange={(e) => setPlaceOfTravel(e.target.value)}
              className="select-box"
            />
          </Box>
        )}

        <Box className="form-section">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography className="label">Letter required for (Reason)</Typography>
              <TextareaAutosize
                required
                minRows={3}
                placeholder="Enter reason for the letter request"
                className="textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}

              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography className="label">Number of Copies</Typography>
              <TextField
                type="number"
                fullWidth
                placeholder="Enter number of copies needed"
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(parseInt(e.target.value) || 1)}
                className="select-box"
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
          </Grid>
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
          />
        </Box>
        


        
          <Box className="form-submit">
            <Button 
              variant="contained" 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
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