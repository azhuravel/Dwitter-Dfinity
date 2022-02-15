import React, { useState, useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';


const Head = () => {
  const navigate = useNavigate();
  const { authCtx, setAuthCtx } = useContext(AuthContext); 

  async function logOut() {
    AuthClient.create().then(authClient => {
      authClient.logout();
      setAuthCtx(null);
      navigate('/');
    });
  }

  async function settings() {
    navigate('/settings');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dwitter
        </Typography>
        {!!authCtx && <Button color="inherit" onClick={settings}>Settings</Button>}
        {!!authCtx && <Button color="inherit" onClick={logOut}>Logout</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default Head;