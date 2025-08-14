import React from 'react';
import "../styles/Navbar.css";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

// You can change this color to match your theme
const menuIconColor = '#222'; // or '#1976d2' for blue accent

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-icon custom-menu-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_347_1718" fill="white">
              <path d="M12 18H4V16H12V18ZM20 13H4V11H20V13ZM20 8H12V6H20V8Z"/>
            </mask>
            <path d="M12 18H4V16H12V18ZM20 13H4V11H20V13ZM20 8H12V6H20V8Z" fill={menuIconColor}/>
            <path d="M12 18V18.5H12.5V18H12ZM4 18H3.5V18.5H4V18ZM4 16V15.5H3.5V16H4ZM12 16H12.5V15.5H12V16ZM20 13V13.5H20.5V13H20ZM4 13H3.5V13.5H4V13ZM4 11V10.5H3.5V11H4ZM20 11H20.5V10.5H20V11ZM20 8V8.5H20.5V8H20ZM12 8H11.5V8.5H12V8ZM12 6V5.5H11.5V6H12ZM20 6H20.5V5.5H20V6ZM12 18V17.5H4V18V18.5H12V18ZM4 18H4.5V16H4H3.5V18H4ZM4 16V16.5H12V16V15.5H4V16ZM12 16H11.5V18H12H12.5V16H12ZM20 13V12.5H4V13V13.5H20V13ZM4 13H4.5V11H4H3.5V13H4ZM4 11V11.5H20V11V10.5H4V11ZM20 11H19.5V13H20H20.5V11H20ZM20 8V7.5H12V8V8.5H20V8ZM12 8H12.5V6H12H11.5V8H12ZM12 6V6.5H20V6V5.5H12V6ZM20 6H19.5V8H20H20.5V6H20Z" fill="white" mask="url(#path-1-inside-1_347_1718)"/>
          </svg>
        </span>
        <span className="navbar-title">Nest</span>
        <div className="navbar-tabs-group">
          <button className="navbar-tab active">My Workspace</button>
          <button className="navbar-tab">Manager Hub</button>
        </div>
      </div>
      <div className="navbar-center">
      </div>
      <div className="navbar-right">
        <div className="navbar-search-wrapper">
          <SearchOutlinedIcon className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="search" 
            className="navbar-search"
          />
        </div>
        <span className="navbar-icon"><CalendarTodayOutlinedIcon /></span>
        <span className="navbar-icon"><EditOutlinedIcon /></span>
        <span className="navbar-icon"><VpnKeyOutlinedIcon /></span>
        <span className="navbar-icon"><BookmarkBorderOutlinedIcon /></span>
        <span className="navbar-icon"><AppsOutlinedIcon /></span>
        <span className="navbar-icon notification">
          <NotificationsNoneOutlinedIcon />
          <span className="dot">4</span>
        </span>
        <div className="navbar-user">
          <img className="navbar-avatar" src="/avatar.png" alt="avatar" />
          <div className="navbar-user-info">
            <div className="navbar-user-name">Isha Kumar</div>
            <div className="navbar-user-title">Sr. Developer</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;