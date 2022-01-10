import React from 'react';

import InternetIdentityAuth from './InternetIdentityAuth.jsx';
import Head from './Head.jsx';

import { StyledEngineProvider } from '@mui/material/styles';
import { Container } from '@mui/material';

const Login = () => {
    return (
      <StyledEngineProvider injectFirst>
        <Container maxWidth="md">
          <Head/>
          <InternetIdentityAuth/>
        </Container>
      </StyledEngineProvider>
    )
  }

  export default Login;