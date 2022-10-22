import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import wealthService from '../services/wealthService';
import nftService from '../services/nftService.js';
import { makeCancelable, icpAgent, getUserNftAvatars } from '../utils/utils.js';
import {postKind_text} from '../constants';


const accountWithNfts = 'a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae';

const User = () => {
    const {ctx} = useContext(AppContext); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [userLoading, setUserLoading] = useState(true); 
    const [isCurrentUserAlreadySubscribed, setIsCurrentUserAlreadySubscribed] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [nftWealth, setNftWealth] = useState(0);
    const [nftAvatar, setNftAvatar] = useState(null);
    const [nftsLoading, setNftsLoading] = useState(true); 
    const [subscriptionsCount, setSubscriptionsCount] = useState(0); 
    const [subscribersCount, setSubscribersCount] = useState(0); 
    const [nfts, setNfts] = useState([]);
    const {username} = useParams();
    const isCurrentUserProfile = (username === ctx.currentUser.username);
    const needToFakeWealth = localStorage.getItem(`load_nfts.${username}`);

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getUserByUsername(username));

        cancelable.promise
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                setIsCurrentUserAlreadySubscribed(user?.subscribers.includes(ctx.currentUser.id));
                setSubscriptionsCount(user?.subscribedTo.length);
                setSubscribersCount(user?.subscribers.length);
                setUserLoading(false);
            })
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
       const cancelable = makeCancelable(wealthService.getBalance(ctx.principal));
       //const cancelable = makeCancelable(wealthService.getBalance('cuqd4-b54ae-keit4-7qgoa-ro7vy-3vdpi-6ni2h-rckht-atdp2-s3ugp-uae'));
        cancelable.promise
            .then((balance) => setBalance(balance))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load NFT wealth of user.
    useEffect(() => {
        if (!user) {
            return;
        }

        let userPrincipal = needToFakeWealth ? accountWithNfts : user?.userPrincipal;
        // const cancelable = makeCancelable(wealthService.getNftWealth(ctx.principal));
        const cancelable = makeCancelable(wealthService.getNftWealth(userPrincipal));
        cancelable.promise
            .then((nftWealth) => setNftWealth(nftWealth))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [user]);

    // Load nfts of user.
    useEffect(() => {
        if (!user) {
            return;
        }

        setNftsLoading(true);

        let userPrincipal = needToFakeWealth ? accountWithNfts : user?.userPrincipal;
        const cancelable = makeCancelable(nftService.getDigestedNfts(userPrincipal));
        // const cancelable = makeCancelable(nftService.getDigestedNfts(ctx.accountIdentifier));
        // const cancelable = makeCancelable(nftService.getDigestedNfts('a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae'));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .then(() => setNftsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [user]);

    const submitPostCallback = async (preparedText) => {
        const post = await ctx.apiService.createPost(preparedText, [], postKind_text);
        setPosts(currentPosts => ([post, ...currentPosts]));
    }

    const subscribeToUser = async (username) => {
        ctx.apiService.subscribeToUser(username);
        setIsCurrentUserAlreadySubscribed(true);
        setSubscribersCount(subscribersCount + 1);
    }

    const unsubscribeFromUser = async (username) => {
        ctx.apiService.unsubscribeFromUser(username);
        setIsCurrentUserAlreadySubscribed(false);
        setSubscribersCount(subscribersCount - 1);
    }

    const calculateBoxMargingBottom = () => {
        if (isCurrentUserProfile) {
            return '0px';
        }
        return '20px';
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
                <UserCard userLoading={userLoading} username={username} user={user} nftAvatar={nftAvatar} />

                <Box sx={{ border: '2px solid #2196f3', borderRadius: '20px', padding: '20px' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: calculateBoxMargingBottom() }}>
                        <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                            <Typography variant="p" component="p">{subscribersCount}</Typography>
                            <Typography variant="p" component="p" sx={{color: '#aaa'}}>Subscribers</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                            <Typography variant="p" component="p">{subscriptionsCount}</Typography>
                            <Typography variant="p" component="p" sx={{color: '#aaa'}}>Subscriptions</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                            <Typography variant="p" component="p">{balance}</Typography>
                            <Typography variant="p" component="p" sx={{color: '#aaa'}}>Balance (ICP)</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                            <Typography variant="p" component="p">{nftWealth}</Typography>
                            <Typography variant="p" component="p" sx={{color: '#aaa'}}>NFT wealth (ICP)</Typography>
                        </Box>
                    </Box>

                    {!isCurrentUserProfile 
                        &&
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', textAlign: 'center'}}>
                            <Box>
                                {isCurrentUserAlreadySubscribed
                                    &&
                                    <LoadingButton type="submit" variant="contained" loading={userLoading} onClick={() => unsubscribeFromUser(username)}>Unsubscribe</LoadingButton>
                                }
                                {!isCurrentUserAlreadySubscribed
                                    &&
                                    <LoadingButton type="submit" variant="contained" loading={userLoading} onClick={() => subscribeToUser(username)}>Subscribe</LoadingButton>
                                }
                            </Box>
                        </Box>
                    }
                </Box>
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
                        <PostsList posts={posts} />
                    </Box>
                }
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>
        </Grid>
    )
};

export default User;
