import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import { getAllUserNFTs, getNFTActor } from '@psychedelic/dab-js';


const NftsSlider = (props) => {
    const nfts = props.nfts || [];
    const nftSelectable = props?.nftSelectable || false;
    const onNftAvatarSelected = props.onNftAvatarSelected;
    const isLoading = props.isLoading;
    const nftsOfCurrentUser = props.nftsOfCurrentUser;

    if (isLoading) {
        return (<p>NFTs are loading...</p>)
    }

    if (nfts.length === 0) {
        if (nftsOfCurrentUser) {
            return (<p>You don't have NFTs, but you can buy them <a target="_blank" href="https://entrepot.app">here</a></p>)
        } else {
            return (<p>User doesn't have NFTs</p>)
        }
    }

    const rowHeight = nftSelectable ? 200 : 110;

    return (
        <ImageList cols={10} rowHeight={rowHeight}>
            {nfts.map((nft) => (
                <ImageListItem key={nft.tokenId}>
                    <embed src={nft.url} width="100" height="100" /> 
                    {nftSelectable 
                        && 
                        <Button variant="text" onClick={() => onNftAvatarSelected(nft)}>Use as avatar</Button>
                    }
                </ImageListItem>
            ))}
        </ImageList>
    )
}

export default NftsSlider;
