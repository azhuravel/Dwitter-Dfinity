import React, {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import WealthService from '../services/wealthService.js';

const User = () => {
    const {ctx} = useContext(AuthContext); 
    const [postsLoading, setPostsLoading] = useState(false); 
    const [userLoading, setUserLoading] = useState(false); 
    const [userNotFound, setUserNotFound] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const params = useParams();
    const username = params.username;
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    useEffect(() => {
        fetchPosts();
        fetchUser();
        fetchBalance();
    }, [username]);

    const fetchPosts = async () => {
        setPostsLoading(true);
        const getUserPostsResp = await ctx.dwitterActor.getUserPosts(username);
        if (getUserPostsResp) {
            const posts = getUserPostsResp[0] || [];
            setPosts(posts);
        }
        setPostsLoading(false);
    }

    const fetchUser = async () => {
        setUserLoading(true);
        if (isCurrentUserProfile) {
            setUser(ctx.currentUser);
        } else {
            const getUserByUsernameResp = await ctx.dwitterActor.getUserByUsername(username);
            if (getUserByUsernameResp && getUserByUsernameResp[0]) {
                setUser(getUserByUsernameResp[0]);
            } else {
                setUserNotFound(true);
            }
        }
        setUserLoading(false);
    }

    const fetchBalance = async() => {
        const balance = await WealthService.getBalance(ctx.accountIdentifier);
        setBalance(balance);
    }

    if (userNotFound) {
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

            {isCurrentUserProfile 
                && 
                <React.Fragment>
                    <Grid item lg={2} md={2} sm={0}/>
                    <Grid item lg={8} md={8} sm={12}>
                        <PostForm postCreatedCallback={fetchPosts} />
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
