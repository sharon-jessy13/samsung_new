import React from 'react';
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
import useProofDetailsForm from '../Hooks/useProofDetailsForm';
// Removed unused access-related API imports


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
  officeAddress,
  setOfficeAddress,
  mempId,
  setMempId,
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

      <Box className="form-section">
        <Grid container spacing={2}>
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

        <Box className="form-section">
          <Grid container spacing={2}>
            
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
              type="button" 
              className="submit-button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>


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