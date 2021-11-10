import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
import { AuthClient } from "@dfinity/auth-client";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css';
import PostForm from './postForm.jsx';
import { StyledEngineProvider } from '@mui/material/styles';
import { Container } from '@mui/material';

const Home = () => {
  return (
    <StyledEngineProvider injectFirst>
      <Container maxWidth="md">
        <Head/>
        <PostForm/>
      </Container>
    </StyledEngineProvider>
  )
}

const Auth = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AuthClient.create().then(authClient => {
      if (authClient.isAuthenticated()) {
        setLoggedIn(true);
      }
    });
  }, []) 

  async function auth() {
    const authClient = await AuthClient.create();
    if (authClient.isAuthenticated()) {
      setLoggedIn(true);
    } else {
      await authClient.login({
        onSuccess: async () => {
          setLoggedIn(true)
        },
          identityProvider: process.env.LOCAL_II_CANISTER,
        });
    }
  }

  return (loggedIn ? <Home/> :
    <Container maxWidth="sm">
      <Head/>
      <Row style={{display: loggedIn ? 'none' : 'block' }}>
        <div className="col text-center"> 
          <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
        </div>
      </Row>
    </Container>
  );
};

const Head = () => {
  return (
      <Row>
        {/* <div className="col text-center">
          <h1>Dwitter - Twitter on the Internet Computer!</h1>
        </div> */}
      </Row>
  )
}

render(<Auth />, document.getElementById("app"));