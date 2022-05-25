import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import PlugConnect from '@psychedelic/plug-connect';
import { AuthContext } from '../context/index.js';
import AuthService from "../services/authService.js";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SVG from "react-svg-raw";


const Login = () => {
    const {setCtx,setLoading} = useContext(AuthContext);
    const plugWhitelist = [process.env.DWITTER_CANISTER_ID, process.env.DWITTER_ASSETS_CANISTER_ID];

    const auth = async () => {
        setLoading(true);
        const ctx = await AuthService.loginByII();
        setLoading(false);
        setCtx(ctx);
    }
    
    const plugBtnCallback = async () => {
        setLoading(true);
        const ctx = await AuthService.loginByPlug();
        setLoading(false);
        setCtx(ctx);
    }

    return (
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography component="h6" variant="h6">Welcome to</Typography>
            <Typography component="h1" variant="h1" sx={{fontWeight: 'bold'}}>Dwitter</Typography>
            <Box component="main" sx={{mt: 5}}>
                <Grid container spacing={2}  justifyContent="center" alignItems="center">
                    {/* <Grid item sx={{alignItems: 'center'}}>
                        <Button variant="outlined" onClick={auth} sx={{color: '#000', fontWeight: 600, fontFamily: 'Arial', borderRadius: '10px', borderWidth:'2px'}}>
                            <span style={{"marginRight": "10px", "fontSize": "16px"}}>Login with</span>
                            <SVG src={`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="-1 -1 107.42470599999999 54.6597" width="30.42" height="20.66" class="inline h-8 w-8 ml-1" data-v-80e6853a="" data-v-53c84d94=""><defs data-v-80e6853a=""><path d="M59.62 9.14C56.48 11.99 53.72 15.07 51.71 17.53C51.71 17.53 54.95 21.18 58.49 25.09C60.41 22.72 63.17 19.51 66.36 16.61C72.26 11.2 76.1 10.11 78.33 10.11C86.64 10.11 93.37 16.92 93.37 25.35C93.37 33.7 86.64 40.51 78.33 40.6C77.94 40.6 77.46 40.55 76.89 40.42C79.29 41.52 81.92 42.31 84.37 42.31C99.58 42.31 102.55 32.03 102.72 31.28C103.16 29.39 103.42 27.42 103.42 25.4C103.38 11.38 92.15 0 78.33 0C72.56 0 66.27 3.08 59.62 9.14Z" id="a2oTCciHwU" data-v-80e6853a=""></path><linearGradient id="gradientc2rIvyDhN" gradientUnits="userSpaceOnUse" x1="65.17" y1="3.67" x2="99.9" y2="39.44" data-v-80e6853a=""><stop offset="21%" data-v-80e6853a="" style="stop-color: rgb(241, 90, 36); stop-opacity: 1;"></stop><stop offset="68.41000000000001%" data-v-80e6853a="" style="stop-color: rgb(251, 176, 59); stop-opacity: 1;"></stop></linearGradient><path d="M43.8 41.52C46.95 38.66 49.7 35.59 51.71 33.13C51.71 33.13 48.48 29.48 44.94 25.57C43.01 27.94 40.26 31.15 37.07 34.05C31.17 39.41 27.28 40.55 25.09 40.55C16.79 40.55 10.05 33.74 10.05 25.31C10.05 16.96 16.79 10.15 25.09 10.06C25.48 10.06 25.97 10.11 26.53 10.24C24.13 9.14 21.51 8.35 19.06 8.35C3.85 8.35 0.87 18.63 0.7 19.38C0.26 21.27 0 23.24 0 25.26C0 39.28 11.23 50.66 25.09 50.66C30.86 50.66 37.16 47.58 43.8 41.52Z" id="aFWcwFIax" data-v-80e6853a=""></path><linearGradient id="gradientaIMror5Zz" gradientUnits="userSpaceOnUse" x1="38.22" y1="46.97" x2="3.5" y2="11.2" data-v-80e6853a=""><stop offset="21%" data-v-80e6853a="" style="stop-color: rgb(237, 30, 121); stop-opacity: 1;"></stop><stop offset="89.29%" data-v-80e6853a="" style="stop-color: rgb(82, 39, 133); stop-opacity: 1;"></stop></linearGradient><path d="M19.1 8.57C5.24 8.23 1.16 18.1 0.81 19.37C3.47 8.3 13.37 0.04 25.14 0C34.73 0 44.43 9.21 51.59 17.53C51.6 17.51 51.61 17.5 51.62 17.49C51.62 17.49 54.86 21.13 58.4 25.04C58.4 25.04 62.42 29.7 66.71 33.79C68.37 35.37 76.45 41.74 84.23 41.96C98.49 42.36 102.42 31.94 102.64 31.15C100.02 42.27 90.09 50.57 78.29 50.62C68.69 50.62 58.99 41.4 51.8 33.08C51.78 33.1 51.77 33.11 51.76 33.13C51.76 33.13 48.52 29.48 44.98 25.57C44.98 25.57 40.96 20.91 36.68 16.83C35.01 15.25 26.88 8.79 19.1 8.57ZM0.81 19.37C0.8 19.4 0.79 19.43 0.79 19.46C0.79 19.44 0.8 19.41 0.81 19.37Z" id="e1RZG6bOc" data-v-80e6853a=""></path></defs><g data-v-80e6853a=""><g data-v-80e6853a=""><use xlink:href="#a2oTCciHwU" opacity="1" fill="url(#gradientc2rIvyDhN)" data-v-80e6853a=""></use><g data-v-80e6853a=""><use xlink:href="#a2oTCciHwU" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0" data-v-80e6853a=""></use></g></g><g data-v-80e6853a=""><use xlink:href="#aFWcwFIax" opacity="1" fill="url(#gradientaIMror5Zz)" data-v-80e6853a=""></use><g data-v-80e6853a=""><use xlink:href="#aFWcwFIax" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0" data-v-80e6853a=""></use></g></g><g data-v-80e6853a=""><use xlink:href="#e1RZG6bOc" opacity="1" fill="#29abe2" fill-opacity="1" data-v-80e6853a=""></use><g data-v-80e6853a=""><use xlink:href="#e1RZG6bOc" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="1" stroke-opacity="0" data-v-80e6853a=""></use></g></g></g></svg>`}/>
                        </Button>
                    </Grid> */}
                    <Grid item sx={{alignItems: 'center'}}>
                        <PlugConnect host={AuthService.getPlugHost()} whitelist={plugWhitelist} onConnectCallback={plugBtnCallback} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;
