import React from 'react';
import DwitterAvatar from "../DwitterAvatar/DwitterAvatar";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import moment from "moment";
import Skeleton from '@mui/material/Skeleton';


const UserCard = (props) => {
    const {username, nftAvatar, userLoading} = props;
    let displayname = props?.user?.displayname;
    let balance = props?.balance ?? 0;
    let nftWealth = props?.nftWealth ?? 0;
    const createdTime = (props?.user?.createdTime || 0n ) / 1000000000n;
    const bio = props?.user?.bio?.[0] ?? '';

    const getCardTitle = () => {
        if (userLoading) {
            return <Skeleton animation="wave" />
        } 
        return <span>{displayname}</span>
    }

    const getCardSubheader = () => {
        if (userLoading) {
            return <Skeleton animation="wave" />
        } 
        return <span>{`@${username} ${bio} - joined ${moment.unix(Number(createdTime)).fromNow()} - balance ${balance} ICP - NFT wealth ${nftWealth} ICP`}</span>
    }

    return (
        <Card elevation={0} variant='body1'>
            <CardHeader
                sx={{px:0}}
                avatar={<DwitterAvatar loading={props.userLoading} displayname={props?.user?.displayname} nftAvatarId={nftAvatar} />}
                title={getCardTitle()}
                subheader={getCardSubheader()}
            />
        </Card>
    )
}

export default UserCard;
