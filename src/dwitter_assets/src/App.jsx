import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/UI/Navbar/Navbar.jsx";
import {AuthContext} from "./context";
import AuthService from "./services/authService.js";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';


const App = () => {
    const [ctx, setCtx] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(async () => {
        setLoading(true);

        const dwitterActor = await AuthService.getDwitterActor();
        const currentUser = await AuthService.getCurrentUser(dwitterActor);
        
        setCtx({dwitterActor, currentUser});
        setLoading(false);
    }, [])

    return (
        <AuthContext.Provider value={{
            ctx, 
            setCtx,
            isLoading,
            setLoading
        }}>
            <BrowserRouter>
                {ctx.dwitterActor && <Navbar/>}
                <Container maxWidth="md">
                    <CssBaseline />
                    <AppRouter/>
                </Container>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App;
