import React from 'react';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import moment from "moment";


const UserCard = (props) => {
    const {username, nftAvatar} = props;
    let displayname = 'Loading...';
    let balance = '?';
    let nftWealth = '?';
    if (!props.userLoading) {
        displayname = props?.user?.displayname;
        balance = props?.balance;
        nftWealth = props?.nftWealth;
    }
    const createdTime = (props?.user?.createdTime || 0n ) / 1000000000n;
    const bio = props?.user?.bio || '';

    return (
        <Card elevation={0} variant='body1'>
            <CardHeader
                sx={{px:0}}
                avatar={<DwitterAvatar loading={props.userLoading} displayname={props?.user?.displayname} nftAvatar={nftAvatar} />}
                title={displayname}
                subheader={`@${username} ${bio} - joined ${moment.unix(Number(createdTime)).fromNow()} - balance ${balance} ICP - NFT wealth ${nftWealth} ICP`}
            />
        </Card>
    )
}

export default UserCard;
