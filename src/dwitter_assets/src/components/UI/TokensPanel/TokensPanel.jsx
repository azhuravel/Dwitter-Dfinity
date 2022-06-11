import React, {useState, useContext} from 'react';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { e8sToICPstr } from '../../../utils/utils.js';
import LoadingButton from '@mui/lab/LoadingButton';


const TokensPanel = (props) => {
    const {user, buyCallback, sellCallback, isLoading} = props;
    const [isDisabled, setIsDisabled] = useState(false);

    const buyPrice = e8sToICPstr(user?.token?.buyPrice);
    const sellPrice = e8sToICPstr(user?.token?.sellPrice);
    const totalCount = Number(user?.token?.totalCount ?? 0);
    const ownedCount = Number(user?.token?.ownedCount ?? 0);
    const canisterPrincipal = user?.canisterPrincipal;
    const accountIdentifier = user?.accountIdentifier;
    const hasTokens = ownedCount > 0;

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
            <p>You have {ownedCount} {ownedCount == 1 ? 'token' : 'tokens'} of this author</p>
            <p>Author sold {totalCount} {totalCount == 1 ? 'token' : 'tokens'} in total</p>
            <p>
                <LoadingButton variant="contained" loading={isDisabled} onClick={buy(canisterPrincipal, accountIdentifier)} disabled={isDisabled}>Buy 1 token for {buyPrice} ICP</LoadingButton>
            </p>
            <p>
                <Tooltip title="You have no tokens" placement="top" disableFocusListener={hasTokens || isDisabled} disableHoverListener={hasTokens || isDisabled} disableInteractive={hasTokens || isDisabled} disableTouchListener={hasTokens || isDisabled}>
                    <span>
                        <LoadingButton variant="contained" loading={isDisabled} onClick={sell(canisterPrincipal)} disabled={!hasTokens || isDisabled}>Sell 1 token for {sellPrice} ICP</LoadingButton>
                    </span>
                </Tooltip>
            </p>
        </React.Fragment>
    )
}

export default TokensPanel;
