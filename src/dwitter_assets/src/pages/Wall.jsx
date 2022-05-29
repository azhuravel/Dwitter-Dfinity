import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import TokensPanel from '../components/UI/TokensPanel/TokensPanel.jsx';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import wealthService from '../services/wealthService';
import nftService from '../services/nftService.js';
import { makeCancelable, icpAgent, getUserNftAvatars } from '../utils/utils.js';


const User = () => {
    const {ctx} = useContext(AppContext); 
    const [userLoading, setUserLoading] = useState(true); 
    const [user, setUser] = useState(null);
    const [nftAvatar, setNftAvatar] = useState(null);
    const {username} = useParams();

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.dwitterActor.getUserByUsername(username));

        cancelable.promise
            .then((resp) => ((resp && resp[0]) || null))
            .then((user) => {
                setUser(user);
                return user;
            })
            .then(user => setNftAvatar(user?.nftAvatar))
            .then(() => setUserLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);
  
    return (
        <Grid container spacing={3} sx={{mt: 0}}>
            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <UserCard userLoading={userLoading} username={username} user={user} nftAvatar={nftAvatar} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <TokensPanel />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>
        </Grid>
    )
};

export default User;
