import React from "react"
import { useSelector } from "react-redux"

export const getApiHeader = () => {
    const email = useSelector(state => state.Login.email);
    const JWT = useSelector(state => state.Login.JWT);
    const User_ID = useSelector(state => state.Auth.User_ID);
    const GUser = useSelector(state => state.Auth.GUser);
    const header = GUser ? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'INSTRUCTOR',
        token: email,
    } : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': User_ID,
    }

    return header
}