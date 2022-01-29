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
        <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={2} justifyContent="space-between">
                {isCurrentUserProfile 
                    && 
                    <Grid item flexGrow={1}>
                        <PostForm postCreatedCallback={fetchData} />
                    </Grid>
                }
                <Grid item flexGrow={1}>
                    <div style={{ width: '100%' }}>
                        <Box sx={{ display: 'flex' }}>
                            {!loading && <PostsList posts={posts}/>}
                            {loading && <p>Loading...</p>}
                        </Box>
                    </div>
                </Grid>
                <Grid item flexGrow={1}></Grid>
            </Grid>
        </Box>
    )
};

export default User;
