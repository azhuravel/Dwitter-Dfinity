import React from 'react';

const NftAvatar = (props) => {
    return (
        <embed src={props.nft.url} width="20" height="20"/>
    )
};

export default NftAvatar;