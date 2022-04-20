import React from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';


function stringToColor(string) {
    if (!string) {
        return '#eeeeee';
    }

    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

function makeShortName(name) {
    if (!name) {
        name = '';
    }

    const nameParts = name.split(' ');
    let shortName = '';
    switch (nameParts.length) {
        case 0:
            break;
        case 1:
            shortName = nameParts[0][0];
            break;
        case 2:
            shortName = nameParts[0][0] + nameParts[1][0];
            break;
        default:
            shortName = nameParts[0][0] + nameParts[1][0];
    }
    return shortName;
}


const DwitterAvatar = (props) => {
    const {mr, nftAvatar, displayname, hasNftAvatar} = props;
    console.log('nftAvatar =', nftAvatar);
    console.log('hasNftAvatar =', hasNftAvatar);

    if (hasNftAvatar && !nftAvatar) {
        return (<CircularProgress sx={{mr: mr}}/>)
    }

    if (hasNftAvatar && nftAvatar) {
        return (<Avatar sx={{mr: mr}}><embed src={nftAvatar.url} /></Avatar>)
    }

    const shortName = makeShortName(displayname);
    return (
        <Avatar sx={{mr: mr, bgcolor: stringToColor(displayname), fontSize: "1rem"}}>
            {shortName}
        </Avatar>
    );
};

export default DwitterAvatar;
