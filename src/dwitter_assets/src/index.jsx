import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthClient } from "@dfinity/auth-client";

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import PostForm from './postForm.jsx';

const Home = () => {
  return (
    <Container>
      <Head/>
      <PostForm/>
    </Container>
  )
}

const Auth = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  async function auth() {
    const authClient = await AuthClient.create();
    await authClient.login({
      onSuccess: async () => {
        setLoggedIn(true)
      },
        identityProvider: process.env.LOCAL_II_CANISTER,
      });
  }

  return (loggedIn ? <Home/> :
    <Container>
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
        <div className="col text-center">
          <h1>Dwitter - Twitter on the Internet Computer!</h1>
        </div>
      </Row>
  )
}

render(<Auth />, document.getElementById("app"));