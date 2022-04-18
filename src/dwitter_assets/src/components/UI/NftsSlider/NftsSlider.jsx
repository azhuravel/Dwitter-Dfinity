import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { getAllUserNFTs, getNFTActor } from '@psychedelic/dab-js';


const NftsSlider = (props) => {
    const nfts = props.nfts || [];
    
    return (
        <ImageList cols={10} rowHeight={200}>
            {nfts.map((nft) => (
                <ImageListItem key={nft.tokenId}>
                    <embed src={nft.url} width="100" height="100" /> 
                    {/* <ImageListItemBar
                        title="Make avatar"
                        position="below"
                        onClick={() => onAvatarChanged(nft.nftId)}
                    /> */}
                </ImageListItem>
            ))}
        </ImageList>
    )
}

export default NftsSlider;
