import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserDataProvider } from './Context/userDataContext'

function UserProviderWrapper({ children }) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <UserDataProvider navigate={navigate} location={location}>
            {children}
        </UserDataProvider>
    )
}

export default UserProviderWrapper