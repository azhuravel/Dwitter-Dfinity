import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/index.js';


const Settings = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = data.username;
        const displayname = data.displayname;

        if (username !== ctx.currentUser.username) {
            const usernameResponse = await ctx.dwitterActor.getByUsername(username);
            const usernameAvailable = !(usernameResponse[0]);
            if (!usernameAvailable) {
                setError('username', {type: 'server', message: 'Already in use'});
                setSubmitting(false);
                return;
            }
        }

        await ctx.dwitterActor.saveUser({username, displayname});
        const userResponse = await ctx.dwitterActor.getCurrentUser();
        const user = userResponse[0];
        setCtx({...ctx, currentUser: user});

        setSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue={ctx.currentUser.username} 
                    render={({field: {onChange, value}, fieldState: {error}}) => (
                    <TextField
                        label="Username"
                        variant="standard"
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

                <Controller
                    name="displayname"
                    control={control}
                    defaultValue={ctx.currentUser.displayname} 
                    render={({field: {onChange, value}, fieldState: {error}}) => (
                    <TextField
                        label="Display name"
                        variant="standard"
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
                
                <LoadingButton type="submit" variant="outlined" loading={submitting}>Save</LoadingButton>
            </Stack>
        </form>
    );
};

export default Settings;
