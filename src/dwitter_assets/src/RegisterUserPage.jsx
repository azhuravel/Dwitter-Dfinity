import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
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
            error = "Required";
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
        return error;
    }

    const validateDisplayname = () => {
        let error = "";
        if (!displayname) {
            error = "Required";
        } else if (displayname.length < 4 || displayname.length > 15) {
            error = "Length shouled be between 4 and 15 symbols";
        }
        return error;
    }

    useEffect(() => {
        let active = true;

        const validateAvailable = async () => {
            let displaynameError = validateDisplayname();
            let usernameError = await validateUsername();
            if (active) {
                if (!username && !displayname) { // TODO fix the quick hack for empty form
                    setDisplaynameError("");
                    setUsernameError("");
                    setSaveDisabled(true);
                } else {
                    setDisplaynameError(displaynameError);
                    setUsernameError(usernameError);
                    setSaveDisabled(!!displaynameError || !!usernameError);
                }
            }
        };

        validateAvailable();
        
        return () => {
            active = false;
        };
    }, [username, displayname]
)

    const handleUsernameChange = (e) => {
        setSaveDisabled(true);
        setUsername(e.target.value);
    }

    const handleDisplaynameChange = (e) => {
        setSaveDisabled(true);
        setDisplayname(e.target.value);
    }

    const saveUser = () => {
        setSaveDisabled(true);
        let _save = async () => {
            await authCtx.dwitterActor.saveUser({username, displayname});

            // TODO: or redirect to LoginPage or optimized (saveUser can return User object)
            const userResponse = await dwitterActor.getCurrentUser();
            const user = userResponse[0];
            setAuthCtx({
                dwitterActor : authCtx.dwitterActor,
                user : user
            });
            navigate("/user/" + user.username, { replace: true }); 
        }
        _save();
    }

    return (
        <StyledEngineProvider injectFirst>
            <Head/>
            <Grid container justifyContent="center">
                <Grid container xs={4} justifyContent="center" direction="column">
                    <TextField id="standard-basic" 
                        label="Username" 
                        variant="standard" 
                        helperText={usernameError}  
                        value={username}
                        onChange={handleUsernameChange}
                        error={!!usernameError}
                    />
                    <TextField id="standard-basic" 
                        label="Display name" 
                        variant="standard"
                        helperText={displaynameError} 
                        value={displayname}
                        onChange={handleDisplaynameChange}
                        error={!!displaynameError}
                    />
                    <Button variant="contained" disabled={saveDisabled} onClick={saveUser}>Save</Button>
                </Grid>
            </Grid>
        </StyledEngineProvider>
    )
}

export default RegisterUserPage;