import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/UI/Navbar/Navbar.jsx";
import Footer from "./components/UI/Footer/Footer.jsx";
import {AuthContext} from "./context";
import AuthService from "./services/authService.js";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red, blue } from '@mui/material/colors';


const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
    },
    typography: {
        fontFamily: 'PT Mono',
        body1: {
            fontFamily: 'PT Mono',
        },
        h6: {
            fontFamily: 'PT Mono',
        },
        button: {
            fontFamily: 'PT Mono',
        },
        body2: {
            fontFamily: 'PT Mono',
            fontSize: "1rem",
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    cursor: 'pointer',
                }
            },
        },
    },
});

const App = () => {
    const [ctx, setCtx] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(async () => {
        const dwitterActor = await AuthService.getDwitterActor();
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        
        setCtx({dwitterActor, currentUser});
        setLoading(false);
    }, [])

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AuthContext.Provider value={{
                    ctx, 
                    setCtx,
                    isLoading,
                    setLoading
                }}>
                    <BrowserRouter>
                        {ctx.dwitterActor && <Navbar/>}
                        <Container maxWidth="lg">
                            <AppRouter/>
                        </Container>
                        {ctx.dwitterActor && <Footer/>}
                    </BrowserRouter>
                </AuthContext.Provider>
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default App;
