import React, {useContext} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {AppContext} from '../context';
import Loader from './UI/Loader/Loader.jsx';
import Login from '../pages/Login.jsx';
import User from '../pages/User.jsx';
import Wall from '../pages/Wall.jsx';
import Registration from '../pages/Registration.jsx';
import Settings from '../pages/Settings.jsx';
import WipPage from '../pages/WipPage.jsx';
import {appState_notLoggedIn, appState_loading, appState_registrationPage, appState_loggedIn} from "../constants";


const AppRouter = () => {
    const {ctx} = useContext(AppContext);

    console.log(ctx);
    
    switch (ctx.appState) {
        case appState_notLoggedIn:
            return (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/wippage" element={<WipPage />} />
                    <Route path="*" element={<Navigate to ="/login" />}/>
                </Routes>
            );

        case appState_loading:
            return <Loader fullScreen />

        case appState_registrationPage:
            return (
                <Routes>
                    <Route path="/registration" element={<Registration />} />
                    <Route path="*" element={<Navigate to ="/registration" />}/>
                </Routes>
            );

        case appState_loggedIn:
            // const currentUserProfilePath = `/wall/${ctx.currentUser.username}`;
            const currentUserProfilePath = `/user/${ctx.currentUser.username}`;
            return (
                <Routes>
                    <Route path="/user/:username" element={<User />} />
                    {/* <Route path="/wall/:username" element={<Wall />} /> */}
                    <Route path="/user/:username" element={<Wall />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to={currentUserProfilePath} />}/>
                </Routes>
            );
    }
};

export default AppRouter;
