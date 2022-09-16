import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import wealthService from '../services/wealthService';
import nftService from '../services/nftService.js';
import { makeCancelable, icpAgent, getUserNftAvatars } from '../utils/utils.js';
import {postKind_text} from '../constants';


const User = () => {
    const {ctx} = useContext(AppContext); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [userLoading, setUserLoading] = useState(true); 
    const [isCurrentUserAlreadySubscribed, setIsCurrentUserAlreadySubscribed] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [nftWealth, setNftWealth] = useState(null);
    const [nftAvatar, setNftAvatar] = useState(null);
    const [nftsLoading, setNftsLoading] = useState(true); 
    const [nfts, setNfts] = useState([]);
    const {username} = useParams();
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getUserByUsername(username));

        cancelable.promise
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                setIsCurrentUserAlreadySubscribed(user?.subscribers.includes(ctx.currentUser.id));
            })
            .then(() => setUserLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load posts of user.
    useEffect(() => {
        setPostsLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getUserPosts(username));
                
        cancelable.promise
            .then((posts) => setPosts(posts))
            .then(() => setPostsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load balance of user.
    useEffect(() => {
       //const cancelable = makeCancelable(wealthService.getBalance(ctx.principal));
       const cancelable = makeCancelable(wealthService.getBalance('cuqd4-b54ae-keit4-7qgoa-ro7vy-3vdpi-6ni2h-rckht-atdp2-s3ugp-uae'));
        cancelable.promise
            .then((balance) => setBalance(balance))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load NFT wealth of user.
    useEffect(() => {
        const cancelable = makeCancelable(wealthService.getNftWealth(ctx.principal));
        cancelable.promise
            .then((nftWealth) => setNftWealth(nftWealth))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

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
    }, [username]);

    const submitPostCallback = async (preparedText) => {
        const post = await ctx.apiService.createPost(preparedText, [], postKind_text);
        setPosts(currentPosts => ([post, ...currentPosts]));
    }

    const subscribeToUser = async (username) => {
        await ctx.apiService.subscribeToUser(username);
        setIsCurrentUserAlreadySubscribed(true);
    }

    const unsubscribeToUser = async (username) => {
        await ctx.apiService.unsubscribeToUser(username);
        setIsCurrentUserAlreadySubscribed(false);
    }

    if (!userLoading && user === null) {
        return (
            <Grid container spacing={2}>
                <Grid item lg={3} md={3} sm={0}/>
                <Grid item lg={6} md={6} sm={12}>
                    <Box sx={{ display: 'flex' }}>
                        <p>User not found</p>
                    </Box>
                </Grid>
                <Grid item lg={3} md={3} sm={0}/>
            </Grid>
        )
    }
  
    return (
        <Grid container spacing={3} sx={{mt: 0}}>
            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <UserCard userLoading={userLoading} username={username} user={user} balance={balance} nftWealth={nftWealth} nftAvatar={nftAvatar} />
                {!isCurrentUserProfile && isCurrentUserAlreadySubscribed
                    &&
                    <LoadingButton type="submit" variant="contained" loading={false} onClick={() => unsubscribeToUser(username)}>Unsubscribe</LoadingButton>
                }
                {!isCurrentUserProfile && !isCurrentUserAlreadySubscribed
                    &&
                    <LoadingButton type="submit" variant="contained" loading={false} onClick={() => subscribeToUser(username)}>Subscribe</LoadingButton>
                }
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <NftsSlider nftsOfCurrentUser={isCurrentUserProfile} nfts={nfts} isLoading={nftsLoading} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            {isCurrentUserProfile 
                && 
                <React.Fragment>
                    <Grid item lg={2} md={2} sm={0}/>
                    <Grid item lg={8} md={8} sm={12}>
                        <PostForm submitPostCallback={submitPostCallback} />
                    </Grid>
                    <Grid item lg={2} md={2} sm={0}/>
                </React.Fragment>
            }

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                {postsLoading && <Loader/>}
                {!postsLoading && 
                    <Box sx={{ display: 'flex' }}>
                        <PostsList posts={posts}/>
                    </Box>
                }
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>
        </Grid>
    )
};

export default User;
