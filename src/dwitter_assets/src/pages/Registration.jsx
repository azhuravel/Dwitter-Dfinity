import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/index.js';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


const Registration = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = data.username;
        const displayname = data.displayname;

        // Проверить, нет ли пользователя с введенным username.
        const usernameResponse = await ctx.dwitterActor.getUserByUsername(username);
        const usernameAvailable = !(usernameResponse[0]);
        if (!usernameAvailable) {
            setError('username', {type: 'server', message: 'Already in use'});
            setSubmitting(false);
            return;
        }

        // Обновить информацию о пользователе.
        await ctx.dwitterActor.createUser({username, displayname});
        const userResponse = await ctx.dwitterActor.getCurrentUser();
        const user = userResponse[0];
        setCtx({...ctx, currentUser: user});

        setSubmitting(false);
    }

    return (
        <Grid container component="form" spacing={2} onSubmit={handleSubmit(onSubmit)} direction="column" justifyContent="center" alignItems="center" mt={10}>
            <Grid item>
                <Typography variant="h5" component="h5">Sign up</Typography>
            </Grid>
            
            <Grid item>
                <Controller
                    name="username"
                    control={control}
                    defaultValue={''}
                    render={({field: {onChange, value}, fieldState: {error}}) => (
                    <TextField
                        label="Username"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        disabled={submitting}
                        autoFocus
                    />
                    )}
                    rules={{
                        required: 'this is a required',
                        minLength: {value: 4, message: 'Min length is 4'},
                        maxLength: {value: 15, message: 'Max length is 15'},
                    }}
                />
            </Grid>

            <Grid item>
                <Controller
                    name="displayname"
                    control={control}
                    defaultValue={''}
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
                
            <Grid item>
                <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton>
            </Grid>
        </Grid>
    );
};

export default Registration;
