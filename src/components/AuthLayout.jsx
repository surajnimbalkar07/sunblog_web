import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {
    //here we use authentication=true as parameter and not declare it as var or cont or let because it makes it as default value you ensure that if the Protected component is called without explicitly specifying the authentication prop, it defaults to true. This means by default, the component assumes authentication is required.

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {


        // If authentication is required and user is not authenticated, redirect to login
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        }
        // If authentication is not required and user is authenticated, redirect to home    
        else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}