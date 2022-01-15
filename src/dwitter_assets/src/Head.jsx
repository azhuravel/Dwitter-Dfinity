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


const Head = () => {
  const navigate = useNavigate();
  const [_, setLoggedIn] = useState(false);

  async function logOut() {
    AuthClient.create().then(authClient => {
      authClient.logout();
      setLoggedIn(false);
      navigate('/');
    });
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dwitter
        </Typography>
        <Button color="inherit" onClick={logOut}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Head;