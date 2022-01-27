import React from 'react';
import Head from './Head.jsx';
import { StyledEngineProvider } from '@mui/material/styles';
import { Container } from '@mui/material';


const LoginPage = () => {
  return (
    <StyledEngineProvider injectFirst>
      <Head/>
      <Container maxWidth="md">
        <Row>
          <div className="col text-center"> 
            <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
            <PlugConnect host={getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
          </div>
        </Row>
      </Container>
    </StyledEngineProvider>
  )
}

export default LoginPage;