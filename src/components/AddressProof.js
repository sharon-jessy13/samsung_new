import React, { useState } from "react";
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

function Addressproof() {
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [addressChoice, setAddressChoice] = useState("");

  return (
    <Box className="form-section"> 
      <Typography className="section-title">Personal Details</Typography>
      <Grid container spacing={2} className="letter-grid">
        <Grid item xs={12} sm={3}>
          <Typography className="label">Permanent Address</Typography>
          <TextField
            placeholder="Enter Permanent Address"
            value={permanentAddress}
            fullWidth
            onChange={(e) => setPermanentAddress(e.target.value)}
            className="select-box"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography className="label">Current Address</Typography>
          <TextField
            placeholder="Enter Current Address"
            fullWidth
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            className="select-box"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <Typography className="label">
              Letter required for Permanent or Current Address
            </Typography>
            <Select
              value={addressChoice}
              onChange={(e) => setAddressChoice(e.target.value)}
              className="select-box"
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

export default Addressproof;