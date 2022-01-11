import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { AuthClient } from "@dfinity/auth-client";
import { Container } from '@mui/material';
import Row from 'react-bootstrap/Row'
import Button from '@mui/material/Button';

import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthContext } from './AuthContext.jsx';
import  Head  from './Head.jsx';

export const InternetIdentityAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const {authCtx, setAuthCtx} = useContext(AuthContext); 

    const from = location.state?.from?.pathname || "/";
  
    useEffect(() => {
      AuthClient.create().then(authClient => {
        if (authClient.isAuthenticated() && !isAnonymous(authClient)) {
          doLogin(authClient);
        }
      });
    }, []) 
  
    async function auth() {
      const authClient = await AuthClient.create();
      if (authClient.isAuthenticated() && !isAnonymous(authClient)) {
        doLogin(authClient);
      } else {
        await authClient.login({
          onSuccess: async () => {
            doLogin(authClient);
          },
            identityProvider: process.env.LOCAL_II_CANISTER,
          });
      }
    }

    async function doLogin(authClient) {
        const identity = await authClient.getIdentity();
        const dwitterActor = createActor(canisterId, {
            agentOptions: {
                identity,
            },
        });
        const userId = identity.getPrincipal().toText();
        setAuthCtx({
            authClient : authClient,
            dwitterActor : dwitterActor,
            identity : identity,
            userId : userId
        });

        setLoggedIn(true);
        navigate(from === "/" ? "/user/" + userId : from, { replace: true });
    }

    function isAnonymous(authClient) {
        const identity = authClient.getIdentity();
        return identity.getPrincipal().toText() === "2vxsx-fae";
    }
  
    return (
      <Container maxWidth="sm">
        <Row style={{display: loggedIn ? 'none' : 'block' }}>
          <div className="col text-center"> 
            <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
          </div>
        </Row>
      </Container>
    );
  };

  export default InternetIdentityAuth