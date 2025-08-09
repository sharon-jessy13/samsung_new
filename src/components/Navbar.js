import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  CalendarToday,
  Edit,
  VpnKey,
  GridView,
  BookmarkBorder,
  Notifications
} from '@mui/icons-material';

import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <AppBar position="static" className="header-bar">
      <Toolbar className="toolbar">
        {/* Left section */}
        <Box className="left-section">
          <IconButton>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="logo-text">
            Nest
          </Typography>
          <Tabs value={0} textColor="inherit" indicatorColor="primary">
            <Tab label="My Workspace" className="tab-active" />
            <Tab label="Manager Hub" className="tab-inactive" />
          </Tabs>
        </Box>

        {/* Right section */}
        <Box className="right-section">
          <TextField
            placeholder="search"
            variant="outlined"
            size="small"
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="search-icon" />
                </InputAdornment>
              ),
              className: "search-input"
            }}
          />

          <IconButton><CalendarToday /></IconButton>
          <IconButton><Edit /></IconButton>
          <IconButton><VpnKey /></IconButton>
          <IconButton><GridView /></IconButton>
          <IconButton><BookmarkBorder /></IconButton>
          <IconButton>
            <Badge color="error" variant="dot">
              <Notifications />
            </Badge>
          </IconButton>

          <Box className="profile-info">
            <Avatar alt="Isha Kumar" src="/avatar.png" />
            <Box className="profile-text">
              <Typography variant="body2" className="name">Isha Kumar</Typography>
              <Typography variant="caption" className="role">Sr. Developer</Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
