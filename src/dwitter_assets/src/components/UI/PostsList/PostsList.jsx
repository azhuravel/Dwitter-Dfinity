import React from 'react';
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import moment from "moment";


const PostsList = (props) => {
    const re = /@([a-zA-Z0-9]{4,15})/

    const renderText = (text) => {
      let parts = text.split(re);
      for (let i = 1; i < parts.length; i += 2) {
        parts[i] = <Link to={`/user/${parts[i]}`} key={i}>@{parts[i]}</Link>
      }
      return parts
    }

    return (
        <List>
            {
                props.posts.map((item, idx) => 
                    <ListItem key={item.id}>
                        <ListItemAvatar>
                            <Avatar><AccountCircleIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${item.displayname} @${item.username} - ${moment.unix(Number(item.createdTime / 1000000000n)).fromNow()}`}
                            secondary={renderText(item.text)}
                        />
                    </ListItem>
                )
            }
        </List>
    )
}

export default PostsList;
