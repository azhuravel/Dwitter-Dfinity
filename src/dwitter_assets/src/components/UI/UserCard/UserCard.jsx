import React from 'react';
import {Avatar} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';


const UserCard = (props) => {
    const username = props.username;
    let displayname = 'Loading...';
    if (!props.userLoading) {
        displayname = props?.user?.displayname;
    }

    return (
        <Card elevation={0}>
            <CardHeader
                sx={{px:0}}
                avatar={<Avatar></Avatar>}
                title={displayname}
                subheader={`@${username}`}
            />
        </Card>
    )
}

export default UserCard;
