import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import { AuthContext } from '../../../context/index.js';
import {TextField} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useForm, Controller } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';


const POST_MAX_LENGTH = 140;

const PostForm = (props) => {
    const {ctx} = useContext(AuthContext); 
    const {handleSubmit, control, reset} = useForm();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        const preparedText = data.text.trim();
        if (!preparedText) {
            return;
        }
        
        setSubmitting(true);
        const post = {text: preparedText};
        await ctx.dwitterActor.savePost(post);
        props.postCreatedCallback();
        reset({text:''});
        setSubmitting(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3, mb: 1 }}>
                <Avatar sx={{mr: 1}}></Avatar>
                <Controller
                    name="text"
                    control={control}
                    render={({field: {onChange, value}, fieldState: {error}}) => (
                        <TextField
                            label="What's happening?" 
                            value={value}
                            size="small"
                            multiline
                            onChange={onChange}
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            disabled={submitting}
                        />
                    )}
                    rules={{
                        required: 'Type some text',
                        maxLength: {value: POST_MAX_LENGTH, message: `Max length is ${POST_MAX_LENGTH}`},
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <LoadingButton type="submit" variant="contained" loading={submitting}>Save</LoadingButton>
            </Box>
        </form>
    );
}

export default PostForm
