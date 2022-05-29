import React from 'react';
import Button from '@mui/material/Button';


const TokensPanel = (props) => {
    return (
        <React.Fragment>
            <p>You have no tokens of author</p>
            <p>Current token price: 12 ICP</p>
            <Button variant="contained">Buy token</Button>
            <Button variant="contained">Sell token</Button>
        </React.Fragment>
    )
}

export default TokensPanel;
