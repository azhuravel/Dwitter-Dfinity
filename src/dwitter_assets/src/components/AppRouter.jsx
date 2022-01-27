import React, {useContext} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {AuthContext} from '../context/index.js';
import Loader from './UI/Loader/Loader.jsx';
import Login from '../pages/Login.jsx';
import User from '../pages/User.jsx';
import Registration from '../pages/Registration.jsx';


const AppRouter = () => {
    const {ctx, isLoading} = useContext(AuthContext);

    if (isLoading) {
        return <Loader/>
    }

    if (!ctx || !ctx.dwitterActor) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to ="/login" />}/>
            </Routes>
        );
    }

    if (!ctx.currentUser) {
        return (
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="*" element={<Navigate to ="/registration" />}/>
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/user/:name" element={<User />} />
            <Route path="*" element={<Navigate to ="/user/me" />}/>
        </Routes>
    );
};

export default AppRouter;
