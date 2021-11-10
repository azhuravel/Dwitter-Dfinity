import React, { useState, useEffect } from 'react';
import { canisterId, createActor } from "../../declarations/dwitter";
import { AuthClient } from "@dfinity/auth-client";
import Box from '@mui/material/Box';
import { useEffect } from 'react';

import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const PostForm = (props) => {
    const [charRemains, setCharRemains] = useState(140);
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [actor, setActor] = useState(null);
  
    useEffect(() => {
        async function fetchActor() {
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();
            const dwitterActor = createActor(canisterId, {
                agentOptions: {
                    identity,
                },
            });
            setActor(dwitterActor);
        }
        fetchActor();
    }, []);

    useEffect(() => {
        fetchData();
    }, [actor]);
  
    async function post() {
      setPosting(true);
      const post = {
        text : text
      }
      setPostText("");
      const response = await actor.savePost(post);
      console.log(response);
      fetchData();
      setPosting(false);
    }
  
    async function fetchData() {
      setLoading(true);
      const response = await actor?.getPosts();
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
          <List>
            {
              posts.map((item, idx) => 
                <ListItem key={idx}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.text}
                  />
                </ListItem>
              )
            }
          </List>
        </Box>
      </div>
    );
}

export default PostForm