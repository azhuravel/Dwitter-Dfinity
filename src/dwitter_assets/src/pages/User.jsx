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
import SVG from "react-svg-raw";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';



// Get common promise and return cancalable promise.
// Manual:
// https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
const makeCancelable = (promise) => {
    let canceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => canceled ? reject({isCanceled: true}) : resolve(val),
            error => canceled ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => canceled = true,
    };
};

const User = () => {
    const {ctx} = useContext(AuthContext); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [userLoading, setUserLoading] = useState(true); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [nfts, setNfts] = useState([]);
    const {username} = useParams();
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    // Load user profile info.
    useEffect(() => {
        setUserLoading(true);
        const cancelable = makeCancelable(ctx.dwitterActor.getUserByUsername(username));

        cancelable.promise
            .then((resp) => ((resp && resp[0]) || null))
            .then((user) => setUser(user))
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
        const cancelable = makeCancelable(nftService.getDigestedNfts(ctx.accountIdentifier));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    const postCreatedCallback = (post) => {
        setPosts(currentPosts => ([post, ...currentPosts]));
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
                <UserCard userLoading={userLoading} username={username} user={user} balance={balance} />
            </Grid>
            <Grid item lg={2} md={2} sm={0}/>

            <Grid item lg={2} md={2} sm={0}/>
            <Grid item lg={8} md={8} sm={12}>
                <ImageList cols={10} rowHeight={100}>
                    {nfts.map((nft) => (
                        <ImageListItem key={nft.id}>
                            <embed src={nft.url} width="100" height="100"/>    
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
