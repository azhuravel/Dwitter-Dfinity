import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from './AuthContext';
import Feed from './Feed.jsx';

export const UserFeed = () => {
    const [loading, setLoading] = useState(true); 
    const [posts, setPosts] = useState([]);
    const params = useParams();
    const {authCtx, setAuthCtx} = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const response = await authCtx.dwitterActor.getUserPosts(params.dwitterId);
        setPosts(response ? (response[0] || []) : []);
        setLoading(false);
    }
  
    return (
      <div style={{ width: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Feed posts={posts}/>
        </Box>
      </div>
    );
}

export default UserFeed