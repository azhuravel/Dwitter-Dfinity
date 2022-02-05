import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import { AuthContext } from '../../../context/index.js';
import { Button, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const POST_MAX_LENGTH = 140;

const PostForm = (props) => {
    const {ctx} = useContext(AuthContext); 
    const [charRemains, setCharRemains] = useState(POST_MAX_LENGTH);
    const [publishingInProgress, setPublishingInProgress] = useState(false);
    const [text, setText] = useState('');
  
    const createPost = async () => {
        setPublishingInProgress(true);
        const post = {text};
        setPostText('');
        
        // TODO начать возвращать созданный пост из savePost().
        await ctx.dwitterActor.savePost(post);
        
        props.postCreatedCallback();
        setPublishingInProgress(false);

    }
  
    const handleTextChange = (e) => {
        const val = e.target.value;
        setPostText(val);
    }

    const setPostText = (text) => {
        setText(text);
        setCharRemains(POST_MAX_LENGTH - text.length);
    }

    if (publishingInProgress) {
        return (
            <p>Publishing in progress</p>
        );
    }
  
    return (
        <div style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 3, mb: 1 }}>
                <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="text" label="What's happening?" variant="standard" value={text} onChange={e => handleTextChange(e)} maxLength={POST_MAX_LENGTH} fullWidth />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button variant="contained" onClick={createPost} disabled={publishingInProgress || !text}>Publish</Button>
            </Box>
        </div>
    );
}

export default PostForm