import React, {useContext,useState} from 'react';
import {AuthContext} from "../../../context";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AuthService from "../../../services/authService.js";
import {Link} from "react-router-dom";
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";


const Navbar = () => {
    const {ctx,setCtx} = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);

    const logout = () => {
        AuthService.logout();
        setCtx({});
    }

    const currentUserIsSignedUp = !!ctx.currentUser;
    const username = ctx?.currentUser?.username || 'me';
    const displayname = ctx?.currentUser?.displayname || 'No name';

    return (
        <React.Fragment>
            <AppBar position="fixed">
                <Container maxWidth="lg">
                    <Toolbar variant="regular" disableGutters>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Dwitter</Typography>

                        <Button
                            id="basic-button"
                            color="inherit"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            {currentUserIsSignedUp && <DwitterAvatar mr={1} displayname={displayname} nftAvatarId={ctx.currentUser?.nftAvatar} />}
                            {currentUserIsSignedUp && displayname}
                            {!currentUserIsSignedUp && <span>Menu</span>}
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{'aria-labelledby': 'basic-button'}}
                            transformOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        >
                            {currentUserIsSignedUp && <MenuItem component={Link} to={`/user/${username}`} onClick={handleClose}>Profile</MenuItem>}
                            {currentUserIsSignedUp && <MenuItem component={Link} to='/settings' onClick={handleClose}>Settings</MenuItem>}
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar variant="regular" disableGutters/>
        </React.Fragment>
    );
};

export default Navbar;
