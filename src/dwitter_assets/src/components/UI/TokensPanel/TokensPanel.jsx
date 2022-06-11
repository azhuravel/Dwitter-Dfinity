import React from 'react';
import Button from '@mui/material/Button';


const TokensPanel = (props) => {
    const {user, buyCallback, sellCallback} = props;

    const buyPrice = '' + user?.token?.buyPrice;
    const sellPrice = '' + user?.token?.sellPrice;
    const totalCount = '' + user?.token?.totalCount;
    const ownedCount = '' + user?.token?.ownedCount;
    const canisterPrincipal = user?.canisterPrincipal;
    const accountIdentifier = user?.accountIdentifier;

    const buy = (canisterPrincipal, accountIdentifier) => (e) => {
        buyCallback(canisterPrincipal, accountIdentifier);
    }

    const sell = (canisterPrincipal) => (e) => {
        sellCallback(canisterPrincipal);
    }

    return (
        <React.Fragment>
            <p>buyPrice: {buyPrice}</p>
            <p>sellPrice: {sellPrice}</p>
            <p>totalCount: {totalCount}</p>
            <p>ownedCount: {ownedCount}</p>
            
            <Button variant="contained" onClick={buy(canisterPrincipal, accountIdentifier)}>Buy 1 token</Button>
            <Button variant="contained" onClick={sell(canisterPrincipal)}>Sell 1 token</Button>
        </React.Fragment>
    )
}

export default TokensPanel;
