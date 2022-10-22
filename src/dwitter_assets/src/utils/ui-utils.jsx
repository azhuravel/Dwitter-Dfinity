import React from 'react';
import ReactDOM from 'react-dom';
import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@dfinity/principal/lib/esm/utils/getCrc';
import { sha224 } from '@dfinity/principal/lib/esm/utils/sha224';
import { HttpAgent } from "@dfinity/agent";
import fetch from 'cross-fetch';
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';



const renderPostText = (text, linkPrefix) => {
    const re = /@([a-zA-Z0-9]{4,15})/

    let parts = text.split(re);
    for (let i = 1; i < parts.length; i += 2) {
        const username = parts[i];
        parts[i] = <Link component={RouterLink} underline='hover' to={`/${linkPrefix}/${username}`} key={i}>@{username}</Link>
    }
    return parts
}

export {
    renderPostText,
}

