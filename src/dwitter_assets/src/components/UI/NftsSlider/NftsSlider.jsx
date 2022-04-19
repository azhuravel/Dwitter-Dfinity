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

    if (isLoading) {
        return (<p>Nfts are loading...</p>)
    }

    return (
        <ImageList cols={10} rowHeight={200}>
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
