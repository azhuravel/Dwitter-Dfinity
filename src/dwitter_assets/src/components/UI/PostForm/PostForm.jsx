import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import { AuthContext } from '../../../context/index.js';
import { Button, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';


const POST_MAX_LENGTH = 140;

const PostForm = (props) => {
    const {ctx} = useContext(AuthContext); 
    const [charRemains, setCharRemains] = useState(POST_MAX_LENGTH);
    const [publishingInProgress, setPublishingInProgress] = useState(false);
    const [text, setText] = useState('');
  
    const createPost = async () => {
        const preparedText = text.trim();
        if (!preparedText) {
            return;
        }
        
        setPublishingInProgress(true);
        const post = {text: preparedText};
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
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3, mb: 1 }}>
                <Avatar sx={{mr: 1}}></Avatar>
                <TextField 
                    id="text" 
                    size="small"
                    label="What's happening?" 
                    multiline
                    value={text} 
                    onChange={e => handleTextChange(e)} 
                    maxLength={POST_MAX_LENGTH} 
                    disabled={publishingInProgress}
                    fullWidth />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button variant="contained" onClick={createPost} disabled={publishingInProgress}>Publish</Button>
                {/* <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton> */}
            </Box>
        </React.Fragment>
    );
}

export default PostForm
