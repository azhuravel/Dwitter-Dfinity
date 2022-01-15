import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { idlFactory } from '../../declarations/dwitter/dwitter.did.js';

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

    async function authViaPlug() {
      // const nnsCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai' // assets
      const nnsCanisterId = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
          
      const whitelist = [
        nnsCanisterId,
        'ryjl3-tyaaa-aaaaa-aaaba-cai',
      ];

      const host = "http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:8000";
      await window.ic.plug.requestConnect({
        whitelist,
        host,
      });

      const principalId = await window.ic.plug.agent.getPrincipal();
      console.log("principalId ==>", principalId);
      const userId = principalId.toText();

      await window.ic.plug.agent.fetchRootKey()

      const dwitterActor = await window.ic.plug.createActor({
        canisterId: nnsCanisterId,
        interfaceFactory: idlFactory,
      });

      setAuthCtx({
          dwitterActor : dwitterActor,
          userId : userId
      });

      console.log("====>", userId);

      setLoggedIn(true);
      navigate(from === "/" ? "/user/" + userId : from, { replace: true });
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
        <Head/>
        <Row style={{display: loggedIn ? 'none' : 'block' }}>
          <div className="col text-center"> 
            <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
            <Button variant="primary" onClick={authViaPlug}>Sign in plug</Button>
          </div>
        </Row>
      </Container>
    );
  };

  export default InternetIdentityAuth