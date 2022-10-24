import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import CircularProgress from '@mui/material/CircularProgress';
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
import Typography from '@mui/material/Typography';


const Feed = () => {
    const {ctx} = useContext(AppContext); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [posts, setPosts] = useState([]);
    const {username} = useParams();

    // Load posts of user.
    useEffect(() => {
        setPostsLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getFeed(username));
                
        cancelable.promise
            .then((posts) => setPosts(posts))
            .then(() => setPostsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    if (postsLoading) {
        return (
            <Grid container spacing={2}>
                <Grid item lg={3} md={3} sm={0}/>
                <Grid item lg={6} md={6} sm={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '40px' }}>
                        <CircularProgress color="inherit" sx={{mr: 1}}/>
                    </Box>
                </Grid>
                <Grid item lg={3} md={3} sm={0}/>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} sx={{mt: 0}}>
                <Grid item lg={2} md={2} sm={0}/>
                <Grid item lg={8} md={8} sm={12}>
                    <Box sx={{ display: 'flex' }}>
                        {posts
                            &&
                            <PostsList posts={posts} />
                        }
                        {!posts
                            &&
                            <React.Fragment>
                                <Typography variant="h6">Your feed is empty<br />Try to subscribe to someone to see the posts here</Typography>
                            </React.Fragment>
                        }
                    </Box>
                </Grid>
                <Grid item lg={2} md={2} sm={0}/>
            </Grid>
        </React.Fragment>
    )
};

export default Feed;
