import React, { useState, useContext } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PostsList from '../components/UI/PostsList/PostsList.jsx';


// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const WipPage = () => {
    const posts = [
        {
            id: 1,
            displayname: 'displayname',
            username: 'username',
            createdTime: 1644523724745n,
            text: 'text text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhgtext text @fefew роиуц text hewjfk rwhg',
        }
    ];
    return (
        <PostsList posts={posts}/>
    );
};

export default WipPage;
