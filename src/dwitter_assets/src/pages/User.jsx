import React, {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';


const User = () => {
    const {ctx} = useContext(AuthContext); 
    const [postsLoading, setPostsLoading] = useState(false); 
    const [userLoading, setUserLoading] = useState(false); 
    const [userNotFound, setUserNotFound] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const params = useParams();
    const username = params.username;
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    useEffect(() => {
        fetchPosts();
        fetchUser();
    }, [username]);

    const fetchPosts = async () => {
        setPostsLoading(true);
        const getUserPostsResp = await ctx.dwitterActor.getUserPosts(username);
        if (getUserPostsResp) {
            const posts = getUserPostsResp[0] || [];
            console.log(posts);
            setPosts(posts);
        }
        setPostsLoading(false);
    }

    const fetchUser = async () => {
        setUserLoading(true);
        if (isCurrentUserProfile) {
            setUser(ctx.currentUser);
        } else {
            const getByUsernameResp = await ctx.dwitterActor.getByUsername(username);
            if (getByUsernameResp && getByUsernameResp[0]) {
                setUser(getByUsernameResp[0]);
            } else {
                setUserNotFound(true);
            }
        }
        setUserLoading(false);
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
        <Grid container spacing={2}>
            <Grid item lg={3} md={3} sm={0}/>
            <Grid item lg={6} md={6} sm={12}>
                <UserCard userLoading={userLoading} username={username} user={user} />
            </Grid>
            <Grid item lg={3} md={3} sm={0}/>

            {isCurrentUserProfile 
                && 
                <React.Fragment>
                    <Grid item lg={3} md={3} sm={0}/>
                    <Grid item lg={6} md={6} sm={12}>
                        <PostForm postCreatedCallback={fetchPosts} />
                    </Grid>
                    <Grid item lg={3} md={3} sm={0}/>
                </React.Fragment>
            }

            <Grid item lg={3} md={3} sm={0}/>
            <Grid item lg={6} md={6} sm={12}>
                {postsLoading && <Loader/>}
                {!postsLoading && 
                    <Box sx={{ display: 'flex' }}>
                        <PostsList posts={posts}/>
                    </Box>
                }
            </Grid>
            <Grid item lg={3} md={3} sm={0}/>
        </Grid>
    )
};

export default User;
