import React, { useState } from "react"
import { AuthContext } from "./AuthContext"

export const AuthProvider = (props) => {
    const [authCtx, setAuthCtx] = useState(null);

    return(
        <AuthContext.Provider value={{ authCtx, setAuthCtx }}>
            {props.children}
        </AuthContext.Provider>
    )
}