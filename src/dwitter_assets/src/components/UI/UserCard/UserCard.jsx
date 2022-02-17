import React from 'react';
import {Avatar} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import moment from "moment";


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
                subheader={
                    <React.Fragment>
                        {username}
                        {/* {" - "}
                        {moment.unix(Number(props?.user?.createdTime / 1000000000n)).fromNow()} */}
                    </React.Fragment>
                }
            />
        </Card>
    )
}

export default UserCard;
