import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import PlugConnect from '@psychedelic/plug-connect';
import { AuthContext } from '../context/index.js';
import AuthService from "../services/authService.js";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const Login = () => {
    const {setCtx,setLoading} = useContext(AuthContext);
    const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

    const auth = async () => {
        setLoading(true);
        const {dwitterActor, currentUser} = await AuthService.loginByII();
        setLoading(false);
        setCtx({ dwitterActor, currentUser });
    }
    
    const plugBtnCallback = async () => {
        setLoading(true);
        const {dwitterActor, currentUser} = await AuthService.loginByPlug();
        setLoading(false);
        setCtx({dwitterActor, currentUser});
    }

    return (
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography component="h6" variant="h6">Welcome to</Typography>
            <Typography component="h1" variant="h1" sx={{fontWeight: 'bold'}}>Dwitter</Typography>
            <Box component="main" sx={{mt: 5}}>
                <Grid container spacing={2}  justifyContent="center" alignItems="center">
                    <Grid item xs={6} sx={{alignItems: 'center'}}>
                        <Button variant="contained" onClick={auth}>Sign in with Internet Identity</Button>
                    </Grid>
                    <Grid item xs={6} sx={{alignItems: 'center'}}>
                        <PlugConnect host={AuthService.getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;
