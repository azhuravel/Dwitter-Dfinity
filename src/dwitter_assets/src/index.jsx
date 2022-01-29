import React, { useState, useEffect, useContext } from 'react';
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import RequireAuth from './RequireAuth.jsx';
import UserPage from './UserPage.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterUserPage from './RegisterUserPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider.jsx"

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />}/>
          <Route path="/user/:username" element={
            <RequireAuth>
              <UserPage />
            </RequireAuth>
          }/>
          <Route path="/register" element={
            <RequireAuth>
              <RegisterUserPage />
            </RequireAuth>
          }/>
          <Route path="/settings" element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }/>
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

render(<App />, document.getElementById("app"));