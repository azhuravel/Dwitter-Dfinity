import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';
import moment from "moment";
import Typography from '@mui/material/Typography';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import {renderPostText} from "../../../utils/ui-utils.jsx";
import { postKind_nft, postKind_text } from '../../../constants/index';


const PostsList = (props) => {
    const {redirectOnWall} = props;

    const linkPrefix = redirectOnWall ? 'wall' : 'user';

    const buildPostBody = (post) => {
        switch (post.kind) {
            case postKind_text:
                return (<Typography style={{whiteSpace: 'pre-line'}}>{renderPostText(post.text, linkPrefix)}</Typography>);
            case postKind_nft:
                return (<DwitterAvatar mr={1} displayname={''} nftAvatarId={post?.nft?.[0]}/>);
        }
    }
    
    return (
        <List>
            {
                props.posts.map(item => 
                    <ListItem disableGutters key={item.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <DwitterAvatar mr={1} displayname={item.displayname} nftAvatarId={item?.nftAvatar}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {item.displayname}
                                    {" "}
                                    <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${item.username}`}>@{item.username}</Link>
                                    {" - "}
                                    {moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
                                </React.Fragment>
                            }
                            secondary={buildPostBody(item)}
                        />
                    </ListItem>
                )
            }
        </List>
    )
}

export default PostsList;
