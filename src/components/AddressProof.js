import React from "react";
import "../styles/AddressProof.css";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";

function AddressProof({
  permanentAddress,
  setPermanentAddress,
  currentAddress,
  setCurrentAddress,
  addressType,
  setAddressType
}) {
  return (
    <Box className="form-section">
      <Typography className="section-title">Personal Details</Typography>

      {/* Row with 3 equal columns */}
      <Grid container spacing={2} className="address-row">
        <Grid item xs={12} md={4}>
          <Typography className="label">Permanent Address</Typography>
          <TextField
            placeholder="Enter Permanent Address"
            value={permanentAddress}
            fullWidth
            onChange={(e) => setPermanentAddress(e.target.value)}
            className="input-box"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography className="label">Current Address</Typography>
          <TextField
            placeholder="Enter Current Address"
            fullWidth
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            className="input-box"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Typography className="label">
              Letter required for Permanent or Current Address
            </Typography>
            <Select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              className="input-box"
            >
              <MenuItem value="Permanent">Permanent</MenuItem>
              <MenuItem value="Current">Current</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddressProof;
