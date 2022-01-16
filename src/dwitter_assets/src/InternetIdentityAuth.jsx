import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { idlFactory } from '../../declarations/dwitter/dwitter.did.js';
import { AuthClient } from "@dfinity/auth-client";
import { Container } from '@mui/material';
import Row from 'react-bootstrap/Row'
import Button from '@mui/material/Button';
import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthContext } from './AuthContext.jsx';
import PlugConnect from '@psychedelic/plug-connect';


export const InternetIdentityAuth = () => {
    const navigate = useNavigate();
    const { authCtx, setAuthCtx } = useContext(AuthContext); 
  
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
      if (!plugIsAvailable()) {
        return;
      }

      const dwitterAssetsCanisterId = process.env.DWITTER_ASSETS_CANISTER_ID
      const dwitterCanisterId = process.env.DWITTER_CANISTER_ID;

      const requestConnectParams = {
        whitelist: [dwitterCanisterId, dwitterAssetsCanisterId],
      };
      
      // Если приложение запущено локально, то необходимо сообщить Plug, куда переадресовывать 
      // пользователя после аутентификации.
      // По умолчанию plug указывает на production окружение в интернете.
      if (process.env.NODE_ENV === 'development') {
        requestConnectParams['host'] = `http://${dwitterAssetsCanisterId}.localhost:8000`;
      }

      const connected = await window.ic.plug.requestConnect(requestConnectParams);
      if (!connected) {
        return;
      }

      const principalId = await window.ic.plug.agent.getPrincipal();
      const userId = principalId.toText();
      
      // Ошибка "Fail to verify certificate" решается запросом rootKey().
      // Подробней: https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078
      await window.ic.plug.agent.fetchRootKey();

      const dwitterActor = await window.ic.plug.createActor({
        canisterId: dwitterCanisterId,
        interfaceFactory: idlFactory,
      });

      setAuthCtx({
        dwitterActor: dwitterActor,
        userId: userId
      });

      navigate(`/user/${userId}`);
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
        authClient: authClient,
        dwitterActor: dwitterActor,
        identity: identity,
        userId: userId
      });

      navigate(`/user/${userId}`);
    }

    async function plugBtnCallback() {
      const dwitterCanisterId = process.env.DWITTER_CANISTER_ID;
      const principalId = await window.ic.plug.agent.getPrincipal();
      const userId = principalId.toText();

      // Ошибка "Fail to verify certificate" решается запросом rootKey().
      // Подробней: https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078
      await window.ic.plug.agent.fetchRootKey();

      const dwitterActor = await window.ic.plug.createActor({
        canisterId: dwitterCanisterId,
        interfaceFactory: idlFactory,
      });
      
      setAuthCtx({
        dwitterActor: dwitterActor,
        userId: userId,
      });

      navigate(`/user/${userId}`);
    }

    function isAnonymous(authClient) {
      const identity = authClient.getIdentity();
      return identity.getPrincipal().toText() === "2vxsx-fae";
    }

    function plugIsAvailable() {
      return !!window.ic;
    }

    function userIsLoggedIn() {
      return !!authCtx;
    }

    function getPlugHost() {
      // Если приложение запущено локально, то необходимо сообщить Plug, куда переадресовывать 
      // пользователя после аутентификации.
      // По умолчанию plug указывает на production окружение в интернете.
      if (process.env.NODE_ENV === 'development') {
        return `http://${process.env.DWITTER_ASSETS_CANISTER_ID}.localhost:8000`
      }
      return '';
    }
  
    return (
      <Container maxWidth="sm">
        <Row style={{display: userIsLoggedIn() ? 'none' : 'block' }}>
          <div className="col text-center"> 
            <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
            <Button variant="primary" onClick={authViaPlug} disabled={!plugIsAvailable()}>Sign in via Plug</Button>
            {!plugIsAvailable() &&
              <p>Plug is not available. <a href="https://plugwallet.ooo/" target="_blank">Install Plug</a> or make it available.</p>
            }
            <PlugConnect host={getPlugHost()} whitelist={[process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID]} onConnectCallback={plugBtnCallback} />
          </div>
        </Row>
      </Container>
    );
  };

  export default InternetIdentityAuth