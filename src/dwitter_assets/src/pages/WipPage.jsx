import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const WipPage = () => {
    const {handleSubmit, setError, control} = useForm();
    // const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = data.username;
        const displayname = data.displayname;

        sleep(500);

        setSubmitting(false);
    }

    return (
        <Grid container justifyContent="center" direction="column">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue='qweqwe' 
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

                <br/>

                <Controller
                    name="displayname"
                    control={control}
                    defaultValue='zxczxc'
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

                <br/>
                
                {/* <Button type="submit" variant="contained" loading={submitting}>Save</Button> */}
                <LoadingButton type="submit" variant="contained" loading={submitting} loadingIndicator="Loading...">Save</LoadingButton>
            </form>
        </Grid>
    );
};

export default WipPage;
