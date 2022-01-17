import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { StyledEngineProvider } from '@mui/material/styles';
import Head from './Head.jsx';
import { AuthContext } from './AuthContext.jsx';
import { useNavigate } from "react-router-dom";

const RegisterUserPage = () => {
    const navigate = useNavigate();

    const {authCtx, setAuthCtx} = useContext(AuthContext);

    const [usernameError, setUsernameError] = useState("");
    const [username, setUsername] = useState("");

    const [displaynameError, setDisplaynameError] = useState("");
    const [displayname, setDisplayname] = useState("");

    const [saveDisabled, setSaveDisabled] = useState(true);

    async function validateUsername() {
        let error = "";
        if (!username) {
            error = "Should be filled";
        } else if (username.length < 4 || username.length > 15) {
            error = "Length shouled be between 4 and 15 symbols";
        } else {
            const usernameResponse = await authCtx.dwitterActor.getByUsername(username);
            const available = !(usernameResponse[0]);
            if (!available) {
                error = "Already existing";
            }
        }
        // add alphanumeric check
        setUsernameError(error);
    }

    function validateDisplayname() {
        let error = "";
        if (!displayname) {
            error = "Should be filled";
        } else if (displayname.length < 4 || displayname.length > 15) {
            error = "Length shouled be between 4 and 15 symbols";
        }
        setDisplaynameError(error);
    }

    async function validate() {
        validateUsername();
        validateDisplayname();
    }

    async function handleUsernameChange(e) {
        setSaveDisabled(true);
        let val = e.target.value;
        setUsername(val);
        validate();
        if (!displaynameError && !usernameError) {
            setSaveDisabled(false);
        }
    }

    async function handleDisplaynameChange(e) {
        setSaveDisabled(true);
        let val = e.target.value;
        setDisplayname(val);
        validate();
        if (!displaynameError && !usernameError) {
            setSaveDisabled(false);
        }
    }

    async function saveUser() {
        await authCtx.dwitterActor.saveUser({username, displayname});
        setAuthCtx({ ...authCtx, username});
        navigate("/user/" + username, { replace: true }); 
    }

    return (
        <StyledEngineProvider injectFirst>
            <Head/>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '200px', alignItems: 'center' }}>
                <TextField id="standard-basic" 
                    label="Username" 
                    variant="standard" 
                    helperText={usernameError}  
                    value={username}
                    onChange={e => handleUsernameChange(e)}
                />
                <TextField id="standard-basic" 
                    label="Display name" 
                    variant="standard"
                    helperText={displaynameError} 
                    value={displayname}
                    onChange={e => handleDisplaynameChange(e)}
                />
                <Button variant="contained" disabled={saveDisabled} onClick={saveUser}>Save</Button>
            </Box>
        </StyledEngineProvider>
    )
}

export default RegisterUserPage;