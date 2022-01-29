import React, { useEffect, useContext,  } from 'react';
import { useNavigate } from "react-router-dom";
import { idlFactory } from '../../declarations/dwitter/dwitter.did.js';
import { AuthClient } from "@dfinity/auth-client";
import { Container } from '@mui/material';
import Row from 'react-bootstrap/Row'
import Button from '@mui/material/Button';
import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthContext } from './AuthContext.jsx';
import PlugConnect from '@psychedelic/plug-connect';
import { DoorSliding } from '../../../node_modules/@mui/icons-material/index.js';


export const InternetIdentityAuth = () => {
    const navigate = useNavigate();
    const { authCtx, setAuthCtx } = useContext(AuthContext); 
    const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

    const from = location.state?.from?.pathname || '/';
  
    useEffect(() => {
      AuthClient.create().then(authClient => {
        if (authClient.isAuthenticated() && !isAnonymous(authClient)) {
          doLoginWithAuthClient(authClient);
        }
      });
    }, [])
  
    async function auth() {
      const authClient = await AuthClient.create();
      if (authClient.isAuthenticated() && !isAnonymous(authClient)) {
        doLoginWithAuthClient(authClient);
      } else {
        await authClient.login({
          onSuccess: async () => {
            doLoginWithAuthClient(authClient);
          },
          identityProvider: process.env.LOCAL_II_CANISTER,
        });
      }
    }

    async function authViaPlug() {
      if (!plugIsAvailable()) {
        return;
      }

      const requestConnectParams = {
        whitelist: plugWhitelist,
      };
      
      // Если приложение запущено локально, то необходимо сообщить Plug, куда переадресовывать 
      // пользователя после аутентификации.
      // По умолчанию plug указывает на production окружение в интернете.
      if (process.env.NODE_ENV === 'development') {
        requestConnectParams['host'] = `http://${process.env.DWITTER_ASSETS_CANISTER_ID}.localhost:8000`;
      }

      const connected = await window.ic.plug.requestConnect(requestConnectParams);
      if (!connected) {
        return;
      }
      
      // Ошибка "Fail to verify certificate" решается запросом rootKey().
      // Подробней: https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078
      await window.ic.plug.agent.fetchRootKey();

      const dwitterActor = await window.ic.plug.createActor({
        canisterId: process.env.DWITTER_CANISTER_ID,
        interfaceFactory: idlFactory,
      });

      doLogin(dwitterActor);
    }

    async function doLoginWithAuthClient(authClient) {
      const identity = await authClient.getIdentity();
      const dwitterActor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
      doLogin(dwitterActor);
    }

    async function doLogin(dwitterActor) {
      const userResponse = await dwitterActor.getCurrentUser();
      const user = userResponse[0];
      if (!user) {
        setAuthCtx({
          dwitterActor : dwitterActor,
        });
        navigate("/register", { replace: true });
      } else {
        setAuthCtx({
            dwitterActor : dwitterActor,
            user : user
        });
        navigate(from === "/" ? `/user/${user.username}` : from, { replace: true });
      }
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
      
      doLogin(dwitterActor);
    }

    function isAnonymous(authClient) {
      const identity = authClient.getIdentity();
      return identity.getPrincipal().toText() === "2vxsx-fae";
    }

    function plugIsAvailable() {
      return !!window.ic;
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
        <Row>
          <div className="col text-center"> 
            <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
            <Button variant="primary" onClick={authViaPlug} disabled={!plugIsAvailable()}>Sign in via Plug</Button>
            {!plugIsAvailable() &&
              <p>Plug is not available. <a href="https://plugwallet.ooo/" target="_blank">Install Plug</a> or make it available.</p>
            }
            <PlugConnect host={getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
          </div>
        </Row>
      </Container>
    );
  };

  export default InternetIdentityAuth