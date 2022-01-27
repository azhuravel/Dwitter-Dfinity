import React, { useEffect, useContext } from 'react';
import { Container } from '@mui/material';
import Row from 'react-bootstrap/Row'
import Button from '@mui/material/Button';
import PlugConnect from '@psychedelic/plug-connect';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/index.js';
import AuthService from "../services/authService.js";


const Login = () => {
    const {ctx, setCtx} = useContext(AuthContext);
    const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

    const auth = async () => {
        const {dwitterActor, currentUser} = await AuthService.loginByII();
        localStorage.setItem('authed', 'ii');
        setCtx({ dwitterActor, currentUser });
    }

    const plugBtnCallback = async () => {
        const dwitterActor = await AuthService.getDwitterActorByPlug();
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        localStorage.setItem('authed', 'plug');
        setCtx({dwitterActor, currentUser});
    }

    return (
        <Container maxWidth="md">
            <Row>
                <Link to={`/user/me`}>My profile</Link>
                <div className="col text-center"> 
                    <Button variant="primary" onClick={auth}>Sign in with Internet Identity</Button>
                    <PlugConnect host={AuthService.getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
                </div>
            </Row>
        </Container>
    );
};

export default Login;
