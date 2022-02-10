import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import moment from "moment";


const PostsList = (props) => {
    // TODO отрефакторить и вынести функцию оборачивания в ссылки имен пользователей в тексте.
    const re = /@([a-zA-Z0-9]{4,15})/
    const renderText = (text) => {
        let parts = text.split(re);
        for (let i = 1; i < parts.length; i += 2) {
            const username = parts[i];
            parts[i] = <Link to={`/user/${username}`} key={i}>@{username}</Link>
        }
        return parts
    }

    return (
        <List>
            {
                props.posts.map(item => 
                    <ListItem key={item.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar><AccountCircleIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    {item.displayname}
                                    {" "}
                                    <Link to={`/user/${item.username}`}>@{item.username}</Link>
                                    {" - "}
                                    {moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}
                                </React.Fragment>
                            }
                            secondary={renderText(item.text)}
                        />
                    </ListItem>
                )
            }
        </List>
    )
}

export default PostsList;
