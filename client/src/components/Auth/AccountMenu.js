import * as React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

//Material
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

// custom

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: hasWhiteSpace(name) ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name.substring(0, 1),
  };
}

function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

const useStyles = makeStyles({
  navlink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    color: 'inherit',
  }
});

export default function AccountMenu() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, logout, isAuthenticated } = useAuth0();
  const { name, picture, email } = user;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          {
            (picture && picture !== '') ?
            <Avatar alt={name} src={picture} />
            :
            <Avatar {...stringAvatar(user.name)} />
          }

          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated && (window.location.href.indexOf("apps") > -1) ? 
        <MenuItem>
          <Avatar alt={user.name} /> <Link className={classes.navlink} to="/">Home</Link>
        </MenuItem>
        :
        <MenuItem>
          <Avatar alt={user.name} /> <Link className={classes.navlink} to="/apps">Dashboard</Link>
        </MenuItem>
        }
        <Divider />
        <MenuItem>
          <Avatar alt={user.name} /> <Link className={classes.navlink} to="/apps/profile">Profile</Link>
        </MenuItem>
        <MenuItem>
          <Avatar alt={user.name} /> My account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() =>
            logout({
              returnTo: window.location.origin,
            })
          }
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
               
