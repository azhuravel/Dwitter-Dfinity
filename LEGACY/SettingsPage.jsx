import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { StyledEngineProvider } from '@mui/material/styles';
import Head from './Head.jsx';
import { AuthContext } from './AuthContext.jsx';

const SettingsPage = () => {
    const {authCtx, setAuthCtx} = useContext(AuthContext);

    const [displaynameError, setDisplaynameError] = useState("");
    const [displayname, setDisplayname] = useState(authCtx.user.displayname);

    const [saveDisabled, setSaveDisabled] = useState(true);

    // copy paste
    const validateDisplayname = () => {
        let error = "";
        if (!displayname) {
            error = "Required";
        } else if (displayname.length < 4 || displayname.length > 15) {
            error = "Length shouled be between 4 and 15 symbols";
        }
        return error;
    }

    const handleDisplaynameChange = (e) => {
        setSaveDisabled(true);
        setDisplayname(e.target.value);
        let error = validateDisplayname();
        setDisplaynameError(error);
        setSaveDisabled(error);
    }

    const updateUser = () => {
        setSaveDisabled(true);
        let _save = async () => {
            const userResponse = await authCtx.dwitterActor.updateUser({displayname});
            const user = userResponse[0];
            setAuthCtx({
                dwitterActor : authCtx.dwitterActor,
                user : user
            });
            setSaveDisabled(false);
        }
        _save();
    }

    return (
        <StyledEngineProvider injectFirst>
            <Head/>
            <Grid container justifyContent="center">
                <Grid container xs={4} justifyContent="center" direction="column">
                    Username: {authCtx.user.username} (cannot be changed)
                    <TextField id="standard-basic" 
                        label="Display name" 
                        variant="standard"
                        helperText={displaynameError} 
                        value={displayname}
                        onChange={handleDisplaynameChange}
                        error={!!displaynameError}
                    />
                    <Button variant="contained" disabled={saveDisabled} onClick={updateUser}>Save</Button>
                </Grid>
            </Grid>
        </StyledEngineProvider>
    )
}

export default SettingsPage;