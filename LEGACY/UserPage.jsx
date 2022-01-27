import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';
import { StyledEngineProvider } from '@mui/material/styles';
import Head from './Head.jsx';
import { Box, Grid, Container } from '@mui/material';
import PostForm from './postForm.jsx';
import UserFeed from './userFeed.jsx';

const UserPage = () => {
  const {authCtx, setAuthCtx} = useContext(AuthContext); 
  const params = useParams();
  const isHome = params.username === authCtx.user.username;

  return (
    <StyledEngineProvider injectFirst>
      <Head/>
      <Box sx={{ flexGrow: 1 }} >
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item flexGrow={1}>
          </Grid>
          <Grid item flexGrow={1}>
            { isHome ? <PostForm/> : <UserFeed/> }
          </Grid>
          <Grid item flexGrow={1}>
          </Grid>
        </Grid>
      </Box>
    </StyledEngineProvider>
  )
}

export default UserPage;