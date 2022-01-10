import React from 'react';
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Feed = (props) => {
    return (
        <List>
            {
              props.posts.map((item, idx) => 
                <ListItem key={idx}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.text}
                  />
                </ListItem>
              )
            }
          </List>
    )
}

export default Feed;