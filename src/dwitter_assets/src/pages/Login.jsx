import React, { useContext } from 'react';
import PlugConnect from '@psychedelic/plug-connect';
import { AppContext } from '../context/index.js';
import AuthService from "../services/authService.js";
import ApiService from "../services/apiService";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {appState_notLoggedIn, appState_loading, appState_registrationPage, appState_loggedIn} from "../constants";


const Login = () => {
    const {setCtx, ctx} = useContext(AppContext);
    const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];
    
    const plugBtnCallback = async () => {
        setCtx({...ctx, appState: appState_loading});
        const {dwitterActor, principal} = await AuthService.loginByPlug();
        ctx.apiService.setDwitterActor(dwitterActor);
        const currentUser = await ctx.apiService.getCurrentUser();
        const appState = AuthService.getAppState(dwitterActor, currentUser);
        setCtx({...ctx, dwitterActor, currentUser, appState, principal});
    }

    return (
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography component="h6" variant="h6">Welcome to</Typography>
            <Typography component="h1" variant="h1" sx={{fontWeight: 'bold'}}>Dwitter</Typography>
            <Box component="main" sx={{mt: 5}}>
                <Grid container spacing={2}  justifyContent="center" alignItems="center">
                    <Grid item sx={{alignItems: 'center'}}>
                        <PlugConnect host={AuthService.getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;
