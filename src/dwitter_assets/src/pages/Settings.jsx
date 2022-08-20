import React, { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import { AppContext } from '../context/index.js';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import { makeCancelable } from '../utils/utils.js';
import nftService from '../services/nftService.js';
import DwitterAvatar from "../components/UI/DwitterAvatar/DwitterAvatar";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {postKind_nft} from '../constants';


const Settings = () => {
    const {handleSubmit, setError, control} = useForm();
    const {ctx, setCtx} = useContext(AppContext);
    const [submitting, setSubmitting] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [nftsLoading, setNftsLoading] = useState(true); 

    // Load nfts of user.
    useEffect(() => {
        setNftsLoading(true);

        // const cancelable = makeCancelable(nftService.getDigestedNfts(ctx.accountIdentifier));
        const cancelable = makeCancelable(nftService.getDigestedNfts('a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae'));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .then(() => setNftsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, []);
    
    const onSubmit = async (data) => {
        setSubmitting(true);

        const username = ctx.currentUser.username;
        const displayname = data.displayname;
        const bio = data.bio;

        const user = await ctx.apiService.updateUser(username, displayname, bio, ctx.currentUser.nftAvatar);
        setCtx({...ctx, currentUser: user});

        setSubmitting(false);
    }

    const onNftAvatarSelected = async (nftAvatar) => {
        setSubmitting(true);

        const nftId = nftAvatar.nftId;
        await ctx.apiService
            .updateUser(
                ctx.currentUser?.username,
                ctx.currentUser?.displayname,
                ctx.currentUser?.bio?.[0],
                [nftId],
            )
            .then(user => {
                setCtx({...ctx, currentUser: user});

                // Create post with selected NFT as new avatar.
                ctx.apiService.createPost('', [nftId], postKind_nft);
            });

        setSubmitting(false);
    }

    const removeAvatar = async () => {
        if (!confirm('Are you sure?')) {
            return;
        }

        setSubmitting(true);

        await ctx.apiService
            .updateUser(
                ctx.currentUser?.username,
                ctx.currentUser?.displayname,
                ctx.currentUser?.bio?.[0],
                [],
            )
            .then(user => setCtx({...ctx, currentUser: user}));
        
        setSubmitting(false);
    }

    return (
        <React.Fragment>
        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column'}}>

            <Grid container component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{mb: 3}}>Common info</Typography>
                </Grid>

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
                    <Controller
                        name="bio"
                        control={control}
                        defaultValue={ctx.currentUser.bio[0] || ''} 
                        render={({field: {onChange, value}, fieldState: {error}}) => (
                            <TextField
                                label="Bio"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                disabled={submitting}
                                multiline
                            />
                        )}
                        rules={{
                            maxLength: {value: 100, message: 'Max length is 100'},
                        }}
                    />
                </Grid>
                    
                <Grid item xs={12}>
                    <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton>
                </Grid>
            </Grid>
        </Box>

        <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{mb: 1}}>Avatar</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="p" sx={{mb: 1}}>Current avatar:</Typography>
                </Grid>
                
                <Grid item xs={12}>
                    {submitting && <CircularProgress color="inherit" sx={{mr: 1}}/>}
                    {!submitting && <DwitterAvatar mr={1} displayname={ctx.currentUser?.displayname} nftAvatarId={ctx.currentUser?.nftAvatar} />}
                </Grid>

                <Grid item xs={12} sx={{mb: 2}}>
                    <Button disabled={!ctx.currentUser?.nftAvatar || submitting} variant="contained" onClick={removeAvatar}>Remove current NFT from avatar</Button>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="p">You can set any your NFT as avatar</Typography>
                </Grid>
                
                <Grid item lg={8} md={8} sm={12}>
                    <NftsSlider nfts={nfts} nftsOfCurrentUser={true} onNftAvatarSelected={onNftAvatarSelected} nftSelectable isLoading={nftsLoading} disableButtons={submitting} />
                </Grid>
            </Grid>
        </Box>
        </React.Fragment>
    );
};

export default Settings;
