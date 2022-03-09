import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Box, Menu, MenuItem, Avatar, IconButton, Container } from '@mui/material';

import { authActions, authSelectors } from '../../../redux/slices';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector(authSelectors.selectProfile);
  const [anchorMenu, setAnchorMenu] = useState(null);

  const handleOpenUserMenu = event => setAnchorMenu(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorMenu(null);

  const menuOptions = [
    ...(profile.isAdmin ? [{ text: 'Admin', onClick: () => navigate('/admin') }] : []),
    { text: 'Logout', onClick: () => dispatch(authActions.logout.base({ navigate })) },
  ].filter(opt => !!opt.text);

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="a"
            sx={{ flexGrow: 1, cursor: 'pointer', fontStyle: 'uppercase' }}
            onClick={() => navigate('/')}
          >
            Calories Tracker
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={profile.name} src="/static/images/1.jpg" />
            </IconButton>
            <Menu
              keepMounted
              sx={{ mt: '45px' }}
              anchorEl={anchorMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorMenu)}
              onClose={handleCloseUserMenu}
            >
              {menuOptions.map(opt => (
                <MenuItem key={opt.text} onClick={opt.onClick}>
                  <Typography textAlign="center">{opt.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export { Header };
