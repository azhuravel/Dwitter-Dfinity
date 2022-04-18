import React, {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import wealthService from '../services/wealthService.js';
import nftService from '../services/nftService.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { getAllUserNFTs, getNFTActor } from '@psychedelic/dab-js'
import { Actor, HttpAgent, getDefaultAgent } from "@dfinity/agent";
import fetch from 'cross-fetch';

import { makeCancelable } from '../utils/utils.js';

// TODO: move to right place
const DEFAULT_AGENT = new HttpAgent({ fetch, host: 'https://ic0.app/' });

const User = () => {
    const {ctx} = useContext(AuthContext); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [userLoading, setUserLoading] = useState(true); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [nftAvatar, setNftAvatar] = useState(null);
    const [nfts, setNfts] = useState([]);
    const {username} = useParams();
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    // const canisterId = "sr4qi-vaaaa-aaaah-qcaaq-cai";
    // const standard = "EXT";
    // const index = "1";

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.dwitterActor.getUserByUsername(username));

        cancelable.promise
            .then((resp) => ((resp && resp[0]) || null))
            .then((user) => setUser(user))
            .then(() => {
                if (user.nftAvatar && user.nftAvatar.length > 0) {
                    const nftAvatar = user.nftAvatar; // naming...

                    const nftActor = getNFTActor({
                        canisterId : nftAvatar.canisterId, 
                        agent : DEFAULT_AGENT, 
                        standard : nftAvatar.standard
                    });
                    return nftActor.details(nftAvatar.index);
                } else {
                    return null;
                }
            })
            .then(nft => setNftAvatar(nft))
            .then(() => setUserLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load posts of user.
    useEffect(() => {
        setPostsLoading(true);
        const cancelable = makeCancelable(ctx.dwitterActor.getUserPosts(username));
                
        cancelable.promise
            .then((resp) => ((resp && resp[0]) || []))
            .then((posts) => setPosts(posts))
            .then(() => setPostsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load balance of user.
    useEffect(() => {
        const cancelable = makeCancelable(wealthService.getBalance(ctx.accountIdentifier));
        cancelable.promise
            .then((balance) => setBalance(balance))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load nfts of user.
    useEffect(() => {
        // const cancelable = makeCancelable(nftService.getDigestedNfts(ctx.accountIdentifier));
        const cancelable = makeCancelable(nftService.getDigestedNfts('a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae'));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    const postCreatedCallback = (post) => {
        setPosts(currentPosts => ([post, ...currentPosts]));
    }

    const onAvatarChanged = (nftId) => {
        ctx.dwitterActor.updateUser({
            displayname: ctx.currentUser.displayname,
            nftAvatar: [nftId]
        })
        .then((resp) => ((resp && resp[0]) || null))
        .then((user) => { 
            setUser(user);
            //debugger;
        });
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
                <UserCard userLoading={userLoading} username={username} user={user} balance={balance} nftAvatar={nftAvatar} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <ImageList cols={10} rowHeight={200}>
                    {nfts.map((nft) => (
                        <ImageListItem key={nft.id}>
                            <embed src={nft.url} width="100" height="100"/> 
                            <ImageListItemBar
                                title="Make avatar"
                                position="below"
                                onClick={() => onAvatarChanged(nft.nftId)}
                             />   
                        </ImageListItem>
                    ))}
                </ImageList>
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            {isCurrentUserProfile 
                && 
                <React.Fragment>
                    <Grid item lg={2} md={2} sm={0}/>
                    <Grid item lg={8} md={8} sm={12}>
                        <PostForm postCreatedCallback={postCreatedCallback} />
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
