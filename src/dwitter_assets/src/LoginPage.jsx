import React from 'react';

import InternetIdentityAuth from './InternetIdentityAuth.jsx';
import Head from './Head.jsx';

import { StyledEngineProvider } from '@mui/material/styles';
import { Container } from '@mui/material';

const LoginPage = () => {
    return (
      <StyledEngineProvider injectFirst>
        <Head/>
        <Container maxWidth="md">
          <InternetIdentityAuth/>
        </Container>
      </StyledEngineProvider>
    )
  }

  export default LoginPage;