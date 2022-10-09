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
import ReplyIcon from '@mui/icons-material/Reply';


const Post = (props) => {
    const {item, redirectOnWall, isCurrentUserProfile} = props;
    const {ctx} = useContext(AppContext); 

    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(item.likers.includes(ctx.currentUser.id)); 
    const [likesCount, setLikesCount] = useState(item?.likers?.length); 
    const [sharesCount, setSharesCount] = useState(item?.reshareCount ?? 0); 

    const linkPrefix = redirectOnWall ? 'wall' : 'user';

    const buildPostBody = (post) => {
        switch (post.kind) {
            case postKind_text:
                return (<Typography style={{whiteSpace: 'pre-line'}}>{renderPostText(post.text, linkPrefix)}</Typography>);
            case postKind_nft:
                return (<DwitterAvatar mr={1} displayname={''} nftAvatarId={post?.nft} isPostNFT={true} />);
        }
    }
    
    const likePost = async (item) => {
        if (item.resharePostId?.[0]) {
            ctx.apiService.likePost(item.username[0], item.resharePostId[0]);
        } else {
            ctx.apiService.likePost(item.username, item.id);
        }
        setIsLikedByCurrentUser(true);
        setLikesCount(likesCount + 1);
    }

    const dislikePost = async (item) => {
        if (item.resharePostId?.[0]) {
            ctx.apiService.dislikePost(item.username[0], item.resharePostId[0]);
        } else {
            ctx.apiService.dislikePost(item.username, item.id);
        }
        setIsLikedByCurrentUser(false);
        setLikesCount(likesCount - 1);
    }

    const sharePost = async (item) => {
        if (isCurrentUserProfile) {
            alert("You can't share your own posts");
            return;
        }

        if (!confirm('Are you shure?')) {
            return;
        }

        if (item.resharePostId?.[0]) {
            ctx.apiService.sharePost(
                item.kind, 
                item.text, 
                item.nft, 
                item.reshareUserId, 
                item.resharePostId, 
                item.reshareUsername, 
                item.reshareDisplayname,
            );
        } else {
            ctx.apiService.sharePost(
                item.kind, 
                item.text, 
                item.nft, 
                item.userId, 
                item.id, 
                item.username, 
                item.displayname,
            );
        }
        setSharesCount(sharesCount + 1);
    }

    const buildCardContentSx = (post) => {
        if (post.resharePostId?.[0]) {
            return { paddingLeft: 2, paddingRight: 0, borderLeft: '4px solid #000' };
        }
        return { paddingLeft: 0, paddingRight: 0 };
    }

    const buildPostAuthorInfo = (post) => {
        if (post?.reshareUserId && !!post.reshareUserId) {
            return (
                <React.Fragment>
                    {item.displayname}
                    {" "}
                    <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.username}`}>@{item.username}</Link>
                    {" shared from "}
                    <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.reshareUsername}`}>@{item.reshareUsername}</Link>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {item.displayname}
                {" "}
                <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.username}`}>@{item.username}</Link>
            </React.Fragment>
        );
    }

    return (
        <Card variant="outlined" sx={{ border: 'none', paddingLeft: 0, paddingRight: 0 }}>
            <CardHeader
                avatar={
                    <DwitterAvatar mr={1} displayname={item.displayname} nftAvatarId={item?.nftAvatar}/>
                }
                title={buildPostAuthorInfo(item)}
                subheader={moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
                sx={{ paddingLeft: 0, paddingRight: 0 }}
                />
            <CardContent sx={buildCardContentSx(item)}>
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

                <IconButton aria-label="Share" onClick={() => sharePost(item)} sx={{ml: 5}}>
                    <ReplyIcon />
                </IconButton>
                <Typography>{sharesCount}</Typography>
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
                    <Post item={item} redirectOnWall={false} key={idx} isCurrentUserProfile={props?.isCurrentUserProfile} />
                )
            }
        </List>
    )
}

export default PostsList;
