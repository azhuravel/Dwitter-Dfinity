import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/UI/Navbar/Navbar.jsx";
import Footer from "./components/UI/Footer/Footer.jsx";
import {AppContext} from "./context";
import AuthService from "./services/authService.js";
import ApiService from "./services/apiService.js";
import MockedApiService from "./mocks/mockedApiService.js";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import {appState_loading} from "./constants";


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
    let apiService = new ApiService();
    if (process.env.USE_MOCKS) {
        apiService = new MockedApiService();
    }

    const [ctx, setCtx] = useState({
        appState: appState_loading,
    });

    useEffect(async () => {
        const {dwitterActor, principal} = await AuthService.getDwitterActorFromPlug();
        apiService.setDwitterActor(dwitterActor);
        const currentUser = await apiService.getCurrentUser();
        const appState = AuthService.getAppState(dwitterActor, currentUser);
        setCtx({...ctx, dwitterActor, currentUser, appState, apiService, principal});
    }, [])

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppContext.Provider value={{ctx, setCtx}}>
                    <BrowserRouter>
                        <Navbar/>
                        <Container maxWidth="lg">
                            <AppRouter/>
                        </Container>
                        <Footer/>
                    </BrowserRouter>
                </AppContext.Provider>
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default App;
