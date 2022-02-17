import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/index.js';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const Settings = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = ctx.currentUser.username;
        const displayname = data.displayname;
        await ctx.dwitterActor.updateUser({username, displayname});
        const userResponse = await ctx.dwitterActor.getCurrentUser();
        const user = userResponse[0];
        setCtx({...ctx, currentUser: user});

        setSubmitting(false);
    }

    return (
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Grid container component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                    <Controller
                        name="displayname"
                        control={control}
                        defaultValue={ctx.currentUser.displayname} 
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                            <TextField
                                label="Display name"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                disabled={submitting}
                            />
                        )}
                        rules={{
                            required: 'this is a required',
                            minLength: {value: 4, message: 'Min length is 4'},
                            maxLength: {value: 15, message: 'Max length is 15'},
                        }}
                    />
                </Grid>
                    
                <Grid item xs={12}>
                    <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
