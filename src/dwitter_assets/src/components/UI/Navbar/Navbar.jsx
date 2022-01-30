import React, {useContext} from 'react';
import {AuthContext} from "../../../context";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AuthService from "../../../services/authService.js";
import {Link} from "react-router-dom";


const Navbar = () => {
    const {setCtx} = useContext(AuthContext);

    const logout = () => {
        AuthService.logout();
        setCtx({});
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Dwitter</Typography>
                <Button color="inherit">
                    <Link to='/settings'>Settings</Link>
                </Button>
                <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
