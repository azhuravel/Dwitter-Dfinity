import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from './AuthContext.jsx';
import { StyledEngineProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Head from './Head.jsx';
import PostForm from './postForm.jsx';
import UserFeed from './userFeed.jsx';

const UserPage = () => {
  const {authCtx, setAuthCtx} = useContext(AuthContext); 
  const params = useParams();
  const isHome = params.userId === authCtx.userId;

  return (
    <StyledEngineProvider injectFirst>
      <Container maxWidth="md">
        <Head/>
        { isHome ? <PostForm/> : <UserFeed/> }
      </Container>
    </StyledEngineProvider>
  )
}

export default UserPage;