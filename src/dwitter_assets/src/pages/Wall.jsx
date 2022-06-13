import React, {useEffect, useState, useContext} from 'react';
import { AppContext } from '../context/index.js';
import PostsList from '../components/UI/PostsList/PostsList.jsx';
import WallPostForm from '../components/UI/WallPostForm/WallPostForm.jsx';
import UserCard from '../components/UI/UserCard/UserCard.jsx';
import TokensPanel from '../components/UI/TokensPanel/TokensPanel.jsx';
import NftsSlider from '../components/UI/NftsSlider/NftsSlider.jsx';
import Loader from '../components/UI/Loader/Loader.jsx';
import { useParams } from "react-router-dom";
import { Box, Grid } from '@mui/material';
import wealthService from '../services/wealthService';
import nftService from '../services/nftService.js';
import { makeCancelable, icpAgent, getUserNftAvatars } from '../utils/utils.js';
import {postKind_text} from '../constants';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { e8sToICPstr } from '../utils/utils.js';
import Divider from '@mui/material/Divider';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const accountWithNfts = 'a3lk7-mb2cz-b7akx-5ponv-b64xw-dkag4-zrt3g-rml4r-6wr7g-kg5ue-2ae';


const User = () => {
    const {ctx} = useContext(AppContext); 
    const [userLoading, setUserLoading] = useState(false); 
    const [user, setUser] = useState(null);
    const [nftAvatar, setNftAvatar] = useState(null);
    const {username} = useParams();
    const [posts, setPosts] = useState([]);
    const isCurrentUserProfile = (username === ctx.currentUser.username);
    const userHasTokens = (user?.token?.ownedCount ?? 0) > 0;
    const [notifyText, setNotifyText] = React.useState('');
    const [nftsLoading, setNftsLoading] = useState(true); 
    const [nfts, setNfts] = useState([]);
    const [nftWealth, setNftWealth] = useState(null);
    const needToFakeWealth = localStorage.getItem(`load_nfts.${username}`);

    // Load user profile info.
    useEffect(() => {
        if (isCurrentUserProfile) {
            const user = ctx.currentUser;
            setUser(user);
            setNftAvatar(user?.nftAvatar);
            return;
        }

        setUserLoading(true);
        const cancelable = makeCancelable(ctx.apiService.getUserByUsername(username));

        cancelable.promise
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            })
            .then(() => setUserLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load posts of user.
    useEffect(() => {
        const cancelable = makeCancelable(ctx.apiService.getUserPosts(username));
                
        cancelable.promise
            .then((posts) => setPosts(posts))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [username]);

    // Load nfts of user.
    useEffect(() => {
        if (!user) {
            return;
        }

        setNftsLoading(true);

        let userPrincipal = needToFakeWealth ? accountWithNfts : user?.userPrincipal;
        const cancelable = makeCancelable(nftService.getDigestedNfts(userPrincipal));
        cancelable.promise
            .then((nfts) => setNfts(nfts))
            .then(() => setNftsLoading(false))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [user]);

     // Load NFT wealth of user.
     useEffect(() => {
        if (!user) {
            return;
        }

        let userPrincipal = needToFakeWealth ? accountWithNfts : user?.userPrincipal;
        const cancelable = makeCancelable(wealthService.getNftWealth(userPrincipal));
        cancelable.promise
            .then((nftWealth) => setNftWealth(nftWealth))
            .catch((err) => {});

        return () => cancelable.cancel();
     }, [user]);

    const buyCallback = async (canisterPrincipal, accountIdentifier) => {
        const buyPrice = Number(user?.token?.buyPrice);
        let blockIndex = (+new Date() % 10000);

        // Request plug permissions.
        await ctx.apiService.makeUserActor(canisterPrincipal);

        // Request transfer of ICP.
        if (process.env.NODE_ENV !== 'development') {
            const params = {
                to: accountIdentifier,
                amount: buyPrice,
            };
            const plug = window?.ic?.plug;
            const result = await plug.requestTransfer(params);
            console.log('result =', result);

            blockIndex = result.height;
        }

        // Request token.
        const buyTokenResp = await ctx.apiService.buyToken(canisterPrincipal, blockIndex);
        await ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
        
        // Notify user.
        setNotifyText(`Success! Price: ${e8sToICPstr(buyTokenResp?.ok?.price)} ICP`);
    }

    const sellCallback = async (canisterPrincipal) => {
        const sellTokenResp = await ctx.apiService.sellToken(canisterPrincipal);
        await ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
        
        // Notify user.
        setNotifyText(`Success! Price: ${e8sToICPstr(sellTokenResp?.ok?.price)} ICP`);
    }


    const submitPostCallback = async (preparedText) => {
        const targetUserCanisterPrincipal = user?.canisterPrincipal;
        const post = await ctx.apiService.createPostOnWall(targetUserCanisterPrincipal, preparedText, [], postKind_text);
        setPosts(currentPosts => ([post, ...currentPosts]));

        await ctx.apiService.getUserByUsername(username)
            .then((user) => {
                setUser(user);
                setNftAvatar(user?.nftAvatar);
                return user;
            });
        
        // Notify user.
        if (isCurrentUserProfile) {
            setNotifyText(`Sent to your wall`);
        } else {
            setNotifyText(`1 token is transfered to "${user?.username}"`);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setNotifyText('');
    };
  
    return (
        <React.Fragment>
            <Snackbar open={!!notifyText} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {notifyText}
                </Alert>
            </Snackbar>

            <Grid container spacing={3} sx={{mt: 0}}>
                <Grid item lg={2} md={2} sm={0}/>
                <Grid item lg={8} md={8} sm={12}>
                    <UserCard userLoading={userLoading} username={username} user={user} nftAvatar={nftAvatar} balance={e8sToICPstr(user?.balance)} nftWealth={nftWealth} />
                </Grid>
                <Grid item lg={2} md={2} sm={0}/>

                {needToFakeWealth &&
                    <React.Fragment>
                        <Grid item lg={2} md={2} sm={0}/>
                        <Grid item lg={8} md={8} sm={12}>
                            <NftsSlider nftsOfCurrentUser={isCurrentUserProfile} nfts={nfts} isLoading={nftsLoading} />
                        </Grid>
                        <Grid item lg={2} md={2} sm={0}/>
                    </React.Fragment>
                }

                <Grid item lg={2} md={2} sm={0}/>
                <Grid item lg={8} md={8} sm={12}>
                    <TokensPanel user={user} buyCallback={buyCallback} sellCallback={sellCallback} isLoading={userLoading} hasTokens={userHasTokens} />
                </Grid>
                <Grid item lg={2} md={2} sm={0}/>

                <Grid item lg={2} md={2} sm={0}/>
                <Grid item lg={8} md={8} sm={12}>
                    <WallPostForm submitPostCallback={submitPostCallback} hasTokens={userHasTokens} currentUserIsWallOwner={isCurrentUserProfile} />
                </Grid>
                <Grid item lg={2} md={2} sm={0}/>

                <Grid item lg={2} md={2} sm={0}/>
                <Grid item lg={8} md={8} sm={12}>
                    <Divider />
                    
                    <Box sx={{ display: 'flex' }}>
                        <PostsList posts={posts} redirectOnWall />
                    </Box>
                </Grid>
                <Grid item lg={2} md={2} sm={0}/>
            </Grid>
        </React.Fragment>
    )
};

export default User;
