import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const Loader = (props) => {
    let sx = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

    // Установить свойство, чтобы показывать спинер по середине страницы.
    if (props.fullScreen) {
        sx['minHeight'] = '100vh';
    }

    return (
        <Box sx={sx}>
            <CircularProgress />
        </Box>
    );
};

export default Loader;
