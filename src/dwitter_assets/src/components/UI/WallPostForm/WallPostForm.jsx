import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import { AppContext } from '../../../context/index.js';
import {TextField} from '@mui/material';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import {POST_MAX_LENGTH} from "../../../constants";
import { useForm, Controller } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';


const WallPostForm = (props) => {
    const {submitPostCallback, hasTokens, currentUserIsWallOwner} = props;
    const {ctx} = useContext(AppContext); 
    const {handleSubmit, control, reset} = useForm();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        const preparedText = data.text.trim();
        if (!preparedText) {
            return;
        }
        
        setSubmitting(true);
        submitPostCallback(preparedText);
        reset({text:''});
        setSubmitting(false);
    }

    const getTextFieldMessage = () => {
        if (hasTokens) {
            return 'Your message...';
        }
        return 'You have no tokens to write';
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3, mb: 1 }}>
                <DwitterAvatar mr={1} displayname={ctx?.currentUser?.displayname} nftAvatarId={ctx?.currentUser?.nftAvatar}/>
                <Controller
                    name="text"
                    control={control}
                    render={({field: {onChange, value}, fieldState: {error}}) => (
                        <TextField
                            label={getTextFieldMessage()} 
                            value={value}
                            size="small"
                            multiline
                            onChange={onChange}
                            error={!!error}
                            fullWidth
                            helperText={error ? error.message : null}
                            disabled={submitting || (!hasTokens && !currentUserIsWallOwner)}
                        />
                    )}
                    rules={{
                        required: 'Type some text',
                        maxLength: {value: POST_MAX_LENGTH, message: `Max length is ${POST_MAX_LENGTH}`},
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mb: '10px' }}>
                <Tooltip title="You have no tokens" placement="top" disableFocusListener={hasTokens} disableHoverListener={hasTokens} disableInteractive={hasTokens} disableTouchListener={hasTokens}>
                    <span>
                        <LoadingButton type="submit" variant="contained" loading={submitting} disabled={!hasTokens && !currentUserIsWallOwner}>
                            {currentUserIsWallOwner && 'Send'}
                            {!currentUserIsWallOwner && 'Send for 1 token'}
                        </LoadingButton>
                    </span>
                </Tooltip>
            </Box>
        </form>
    );
}

export default WallPostForm
