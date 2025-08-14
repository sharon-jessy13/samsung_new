import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Container,
} from '@mui/material';
import { ArrowBack, AlarmOn, Assignment } from '@mui/icons-material';
import '../styles/HrHeader.css';
import EmployeeState from '../pages/EmployeeState';
import avthar from '../assets/avthar.svg';
import online from "../assets/Avatar online indicator.svg";


export default function HRHeader() {
  const [workflowState, setWorkflowState] = useState('Initiate');
  const employee = {
    name: "Manoj Kandan M",
    genId: "25504878",
    email: "manoj.kandan@partner.samsung.com",
    designation: "Outsourcing",
    division: "Tech Strategy Team\\Smart Infra Group\\Information System & AI Tools",
    manager: "Ravindra S R (06786669)",
    avatar: "/avatar.png"
  };


  return (
    <>
      <Box className="hr-header-container">
        <Typography variant="caption" className="breadcrumb">
          My Workspace &gt; HR Letter
        </Typography>

        <Box className="header-row">
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small">
              <ArrowBack />
            </IconButton>
            <Typography variant="body2">HR Request.{workflowState} </Typography>

          </Box>
          <AlarmOn className="clock-icon" />
        </Box>
        <Grid container alignItems="center">
          {/* Employee Details */}

          <div class="employee-details">
            <div class="avatar-wrapper">
              <img src={avthar} class="avatar" />
              <span class="online-indicator"></span>
            </div>
            <div class="employee-info">
              <strong>{employee.name} • Gen ID: {employee.genId}</strong>
              <div class="employee-email">{employee.email}</div>
            </div>
          </div>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Designation */}
          <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
            <Typography variant="body2" color="text.secondary">Designation</Typography>
            <Typography fontWeight="bold">{employee.designation}</Typography>
          </Grid>

          {/* Divider */}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />


          {/* Division */}
          <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
            <Typography variant="body2" color="text.secondary">Division</Typography>
            <Typography fontWeight="bold">{employee.division}</Typography>
          </Grid>

          {/* Divider */}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />


          {/* Manager */}
          <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
            <Typography variant="body2" color="text.secondary">Manager</Typography>
            <Typography fontWeight="bold">{employee.manager}</Typography>
          </Grid>
        </Grid>

        <Box className="required-info-section">
          <Assignment className="required-info-icon" />
          <Typography fontWeight="bold" className="required-info-text">
            Required Information
          </Typography>
        </Box>
        <EmployeeState />
      </Box>
    </>
  );
}