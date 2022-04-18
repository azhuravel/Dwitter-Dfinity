import React from 'react';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import NftAvatar from "../DwitterAvatar/NftAvatar";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import moment from "moment";


const UserCard = (props) => {
    const username = props.username;
    let displayname = 'Loading...';
    let balance = '?'
    if (!props.userLoading) {
        displayname = props?.user?.displayname;
        balance = props?.balance;
    }
    const createdTime = (props?.user?.createdTime || 0n ) / 1000000000n;

    return (
        <Card elevation={0} variant='body1'>
            <CardHeader
                sx={{px:0}}
                avatar={
                    props.nftAvatar ? <NftAvatar nft={props.nftAvatar}/> : <DwitterAvatar name={displayname}/> 
                }
                title={displayname}
                subheader={`@${username} - joined ${moment.unix(Number(createdTime)).fromNow()} - balance ${balance} ICP`}
            />
        </Card>
    )
}

export default UserCard;
