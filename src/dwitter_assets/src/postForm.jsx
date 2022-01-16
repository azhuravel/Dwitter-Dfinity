import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import { AuthContext } from './AuthContext.jsx';
import Feed from './Feed.jsx';

import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const PostForm = (props) => {
    const {authCtx, setAuthCtx} = useContext(AuthContext); 
    const [charRemains, setCharRemains] = useState(140);
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);
  
    async function post() {
      setPosting(true);
      const post = {
        text : text
      }
      setPostText("");
      const response = await authCtx.dwitterActor.savePost(post);
      fetchData();
      setPosting(false);
    }
  
    async function fetchData() {
      setLoading(true);
      const response = await authCtx.dwitterActor?.getPosts();
      setPosts(response ? (response[0] || []) : []);
      setLoading(false);
    }
  
    function handleTextChange(e) {
      let val = e.target.value;
      setPostText(val);
    }

    function setPostText(text) {
      setText(text);
      setCharRemains(140 - text.length);
    }
  
    return (
      <div style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 3, mb: 1 }}>
          <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField id="text" label="What's happening?" variant="standard" value={text} onChange={e => handleTextChange(e)} maxLength="140" fullWidth />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button variant="contained" onClick={post} disabled={posting}>Publish</Button>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Feed posts={posts}/>
        </Box>
      </div>
    );
}

export default PostForm