import React, {useState, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import nftService from '../../../services/nftService.js';
import { makeCancelable } from '../../../utils/utils.js';


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
    const {mr, displayname, nftAvatarId} = props;
    const defaultState = {
        isLoading: true,
        shortName: makeShortName(displayname),
        avatarUrl: '',
    };
    const [state, setState] = useState(defaultState);

    useEffect(() => {
        setState({...state, isLoading: false, shortName: makeShortName(displayname)});
    }, [displayname]);

    useEffect(() => {
        setState({...state, isLoading: true, avatarUrl: ''});

        const cancelable = makeCancelable(nftService.getUserNftAvatars(nftAvatarId));
        cancelable.promise
            .then(userNftAvatar => setState({...state, isLoading: false, avatarUrl: userNftAvatar?.url}))
            .catch((err) => {});

        return () => cancelable.cancel();
    }, [nftAvatarId]);

    if (state.isLoading) {
        return (<CircularProgress color="inherit" sx={{mr: mr}}/>)
    }

    if (state.avatarUrl) {
        return (<Avatar variant="rounded" sx={{mr: mr}} src={state.avatarUrl} />)
    }

    return (
        <Avatar variant="rounded" sx={{mr: mr, bgcolor: stringToColor(displayname)}}>
            {state.shortName}
        </Avatar>
    );
};

export default DwitterAvatar;
