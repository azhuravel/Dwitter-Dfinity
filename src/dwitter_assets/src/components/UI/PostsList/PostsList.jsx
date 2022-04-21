import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';
import moment from "moment";
import Typography from '@mui/material/Typography';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";


const PostsList = (props) => {
    // TODO отрефакторить и вынести функцию оборачивания в ссылки имен пользователей в тексте.
    const re = /@([a-zA-Z0-9]{4,15})/
    const renderText = (text) => {
        let parts = text.split(re);
        for (let i = 1; i < parts.length; i += 2) {
            const username = parts[i];
            parts[i] = <Link component={RouterLink} underline='hover' to={`/user/${username}`} key={i}>@{username}</Link>
        }
        return parts
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
                                    <Link component={RouterLink} underline='hover' to={`/user/${item.username}`}>@{item.username}</Link>
                                    {" - "}
                                    {moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
                                </React.Fragment>
                            }
                            secondary={
                                <Typography style={{whiteSpace: 'pre-line'}}>{renderText(item.text)}</Typography>
                            }
                        />
                    </ListItem>
                )
            }
        </List>
    )
}

export default PostsList;
