import React, { useState, useEffect, useContext } from 'react';
import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import RequireAuth from './RequireAuth.jsx';
import UserPage from './UserPage.jsx';
import LoginPage from './LoginPage.jsx';
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./AuthProvider.jsx"

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />}/>
          <Route path="/user/:userId" element={
            <RequireAuth>
              <UserPage />
            </RequireAuth>
          }/>
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

render(<App />, document.getElementById("app"));