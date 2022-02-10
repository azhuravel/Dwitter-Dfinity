import React, {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import PostForm from '../components/UI/PostForm/PostForm.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';


const User = () => {
    const {ctx} = useContext(AuthContext); 
    const [loading, setLoading] = useState(false); 
    const [posts, setPosts] = useState([]);
    const params = useParams();
    const username = params.username;
    const isCurrentUserProfile = (username === ctx.currentUser.username);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await ctx.dwitterActor.getUserPosts(username);
        setPosts(response ? (response[0] || []) : []);
        setLoading(false);
    }
  
    return (
        <Grid container spacing={2}>
            {isCurrentUserProfile 
                && 
                <React.Fragment>

                    <Grid item lg={3} md={3} sm={0}/>
                    <Grid item lg={6} md={6} sm={12}>
                        <PostForm postCreatedCallback={fetchData} />
                    </Grid>
                    <Grid item lg={3} md={3} sm={0}/>
                </React.Fragment>
            }

            <Grid item lg={3} md={3} sm={0}/>
            <Grid item lg={6} md={6} sm={12}>
                <Box sx={{ display: 'flex' }}>
                    {!loading && <PostsList posts={posts}/>}
                    {loading && <p>Loading...</p>}
                </Box>
            </Grid>
            <Grid item lg={3} md={3} sm={0}/>
        </Grid>
    )
};

export default User;
