import React, {useEffect, useState, useContext} from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';
import moment from "moment";
import Typography from '@mui/material/Typography';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import {renderPostText} from "../../../utils/ui-utils.jsx";
import { postKind_nft, postKind_text } from '../../../constants/index';
import { AppContext } from '../../../context/index.js';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';


const Post = (props) => {
    const {item, redirectOnWall} = props;
    const {ctx} = useContext(AppContext); 

    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(item.likers.includes(ctx.currentUser.id)); 
    const [likesCount, setLikesCount] = useState(item?.likers?.length); 

    const linkPrefix = redirectOnWall ? 'wall' : 'user';

    const buildPostBody = (post) => {
        switch (post.kind) {
            case postKind_text:
                return (<Typography style={{whiteSpace: 'pre-line'}}>{renderPostText(post.text, linkPrefix)}</Typography>);
            case postKind_nft:
                return (<DwitterAvatar mr={1} displayname={''} nftAvatarId={post?.nft?.[0]}/>);
        }
    }
    
    const likePost = async () => {
        await ctx.apiService.likePost(item.username, item.id);
        setIsLikedByCurrentUser(true);
        setLikesCount(likesCount + 1);
    }

    const dislikePost = async () => {
        await ctx.apiService.dislikePost(item.username, item.id);
        setIsLikedByCurrentUser(false);
        setLikesCount(likesCount - 1);
    }

    return (
        <Card variant="outlined" sx={{ border: 'none', paddingLeft: 0, paddingRight: 0 }}>
            <CardHeader
                avatar={
                    <DwitterAvatar mr={1} displayname={item.displayname} nftAvatarId={item?.nftAvatar}/>
                }
                title={
                    <React.Fragment>
                        {item.displayname}
                        {" "}
                        <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.username}`}>@{item.username}</Link>
                    </React.Fragment>
                }
                subheader={moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                />
            <CardContent sx={{ paddingLeft: 0, paddingRight: 0 }}>
                {buildPostBody(item)}
            </CardContent>
            <CardActions disableSpacing sx={{ paddingLeft: 0, paddingRight: 0 }}>
                {!isLikedByCurrentUser
                    &&
                    <IconButton aria-label="Like" onClick={() => likePost(item)}>
                        <FavoriteIcon />
                    </IconButton>
                }
                {isLikedByCurrentUser
                    &&
                    <IconButton aria-label="Unlike" onClick={() => dislikePost(item)}>
                        <FavoriteIcon sx={{ color: red[500] }} />
                    </IconButton>
                }
                <Typography>{likesCount}</Typography>
            </CardActions>
        </Card> 
    );

    // return (
    //     <ListItem disableGutters key={item.id} alignItems="flex-start">
    //         <ListItemAvatar>
    //             <DwitterAvatar mr={1} displayname={item.displayname} nftAvatarId={item?.nftAvatar}/>
    //         </ListItemAvatar>
    //         <ListItemText
    //             primary={
    //                 <React.Fragment>
    //                     {item.displayname}
    //                     {" "}
    //                     <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.username}`}>@{item.username}</Link>
    //                     {" - "}
    //                     {moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
    //                 </React.Fragment>
    //             }
    //             secondary={buildPostBody(item)}
    //         />
    //         <div>
    //             {!isLikedByCurrentUser
    //                 &&
    //                 <LoadingButton type="submit" variant="contained" loading={false} onClick={() => likePost(item)}>Like</LoadingButton>
    //             }
    //             {isLikedByCurrentUser
    //                 &&
    //                 <LoadingButton type="submit" variant="contained" loading={false} onClick={() => dislikePost(item)}>Unlike</LoadingButton>
    //             }
    //         </div>
    //     </ListItem>
    // );
};


const PostsList = (props) => {
    return (
        <List>
            {
                props.posts.map((item, idx) => 
                    <Post item={item} redirectOnWall={false} key={idx}/>
                )
            }
        </List>
    )
}

export default PostsList;
