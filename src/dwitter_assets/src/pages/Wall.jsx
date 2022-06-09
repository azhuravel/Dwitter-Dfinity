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
import {postKind_text} from '../constants';
import Button from '@mui/material/Button';


const User = () => {
    const {ctx} = useContext(AppContext); 
    const [userLoading, setUserLoading] = useState(true); 
    const [user, setUser] = useState(null);
    const [nftAvatar, setNftAvatar] = useState(null);
    const {username} = useParams();
    const [posts, setPosts] = useState([]);

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getUserByUsername(username));

        cancelable.promise
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            })
            .then(() => setUserLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load posts of user.
    useEffect(() => {
        const cancelable = makeCancelable(ctx.apiService.getUserPosts(username));
                
        cancelable.promise
            .then((posts) => setPosts(posts))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    const buyCallback = async (canisterPrincipal) => {
        let blockIndex = (+new Date() % 10000);

        if (process.env.NODE_ENV !== 'development') {
            const params = {
                to: canisterPrincipal,
                amount: 1,
                opts: {
                    memo: '123451231231',
                },
            };
            const plug = window?.ic?.plug;
            const result = await plug.requestTransfer(params);
            console.log('result =', result);

            blockIndex = result.height;
        }

        await ctx.apiService.buyToken(canisterPrincipal, blockIndex);
        ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
    }

    const sellCallback = async (canisterPrincipal) => {
        await ctx.apiService.sellToken(canisterPrincipal);
        ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
    }


    const submitPostCallback = async (preparedText) => {
        const targetUserCanisterPrincipal = user?.canisterPrincipal;
        const post = await ctx.apiService.createPostOnWall(targetUserCanisterPrincipal, preparedText, [], postKind_text);
        setPosts(currentPosts => ([post, ...currentPosts]));

        await ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
    }
  
    return (
        <Grid container spacing={3} sx={{mt: 0}}>
            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <UserCard userLoading={userLoading} username={username} user={user} nftAvatar={nftAvatar} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <TokensPanel user={user} buyCallback={buyCallback} sellCallback={sellCallback} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <PostForm submitPostCallback={submitPostCallback} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <Box sx={{ display: 'flex' }}>
                    <PostsList posts={posts} redirectOnWall />
                </Box>
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>
        </Grid>
    )
};

export default User;
