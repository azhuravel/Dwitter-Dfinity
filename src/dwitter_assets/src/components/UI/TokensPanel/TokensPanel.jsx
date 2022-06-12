import React, {useState, useContext} from 'react';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { e8sToICPstr } from '../../../utils/utils.js';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';


const TokensPanel = (props) => {
    const {user, buyCallback, sellCallback, isLoading, hasTokens} = props;
    const [isDisabled, setIsDisabled] = useState(false);

    const buyPrice = e8sToICPstr(user?.token?.buyPrice);
    const sellPrice = e8sToICPstr(user?.token?.sellPrice);
    const cap = e8sToICPstr(user?.token?.cap);
    const totalLocked = e8sToICPstr(user?.token?.totalLocked);
    const totalCount = Number(user?.token?.totalCount ?? 0);
    const ownedCount = Number(user?.token?.ownedCount ?? 0);
    const canisterPrincipal = user?.canisterPrincipal;
    const accountIdentifier = user?.accountIdentifier;

    const buy = (canisterPrincipal, accountIdentifier) => async (e) => {
        setIsDisabled(true);
        await buyCallback(canisterPrincipal, accountIdentifier);
        setIsDisabled(false);
    }
    
    const sell = (canisterPrincipal) => async (e) => {
        setIsDisabled(true);
        await sellCallback(canisterPrincipal);
        setIsDisabled(false);
    }

    if (isLoading) {
        return (
            <React.Fragment>
                <Skeleton variant="rectangular" width={210} height={118} />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', mb: '40px' }}>
                <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                    <Typography variant="p" component="p">{ownedCount}</Typography>
                    <Typography variant="p" component="p" sx={{color: '#aaa'}}>Your Tokens</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                    <Typography variant="p" component="p">{totalCount}</Typography>
                    <Typography variant="p" component="p" sx={{color: '#aaa'}}>Tokens In Circulation</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                    <Typography variant="p" component="p">{totalLocked}</Typography>
                    <Typography variant="p" component="p" sx={{color: '#aaa'}}>Total ICP Locked</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '700'}}>
                    <Typography variant="p" component="p">{cap}</Typography>
                    <Typography variant="p" component="p" sx={{color: '#aaa'}}>ICP Market Cap</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', textAlign: 'center'}}>
                <Box>
                    <LoadingButton variant="contained" loading={isDisabled} onClick={buy(canisterPrincipal, accountIdentifier)} disabled={isDisabled}>Buy 1 token for {buyPrice} ICP</LoadingButton>
                </Box>
                <Box>
                    <Tooltip title="You have no tokens" placement="top" disableFocusListener={hasTokens || isDisabled} disableHoverListener={hasTokens || isDisabled} disableInteractive={hasTokens || isDisabled} disableTouchListener={hasTokens || isDisabled}>
                        <span>
                            <LoadingButton variant="contained" loading={isDisabled} onClick={sell(canisterPrincipal)} disabled={!hasTokens || isDisabled}>Sell 1 token for {sellPrice} ICP</LoadingButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default TokensPanel;
