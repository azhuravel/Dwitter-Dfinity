import React, { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/index.js';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import { makeCancelable } from '../utils/utils.js';
import nftService from '../services/nftService.js';
import NftAvatar from "../components/UI/DwitterAvatar/NftAvatar";


const Settings = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [nftAvatar, setNftAvatar] = useState(null);

    // Load nfts of user.
    useEffect(() => {
        // const cancelable = makeCancelable(nftService.getDigestedNfts(ctx.accountIdentifier));
        const cancelable = makeCancelable(nftService.getDigestedNfts('a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae'));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, []);

    // Load user profile info.
    useEffect(() => {
        nftService.getUserNftAvatars(ctx.currentUser).then(userNftAvatar => {
            setNftAvatar(userNftAvatar)
        });
    }, []);
    
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
                        name="username"
                        control={control}
                        defaultValue={ctx.currentUser.username} 
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                            <TextField
                                label="Username"
                                value={value}
                                onChange={onChange}
                                helperText='Cannot be changed'
                                disabled
                            />
                        )}
                    />
                </Grid>

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

            <Grid container spacing={2}>
                {nftAvatar 
                    && 
                    <NftAvatar nft={nftAvatar}/>
                }
                <Grid item lg={8} md={8} sm={12}>
                    <NftsSlider nfts={nfts} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
