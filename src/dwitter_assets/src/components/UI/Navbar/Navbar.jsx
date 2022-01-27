import React, {useContext} from 'react';
import {AuthContext} from "../../../context";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const Navbar = () => {
    const {setCtx} = useContext(AuthContext);

    const logout = () => {
        setCtx({});
        localStorage.removeItem('authed');
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Dwitter</Typography>
                <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
