import React, { useEffect } from 'react'
import { logout } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../features/auth/authApiSlice'
import { Box } from '@mui/material'
import { apiSlice } from '../../app/api/apiSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {clearCachedQueries} from '@reduxjs/toolkit/query'

export default function Logout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [logoutRtk,{
        isLoading,
        isSuccess,
        isError,
        error
    }] = useLogoutMutation()
    const logoutHandler = async ()=>{
        await logoutRtk()
    }
    useEffect(()=>{
        logoutHandler()
    },[])
   
    let content;
    
        
    if(isLoading){
        content = "logging out"
    }else if(isSuccess){
        dispatch(apiSlice.util.resetApiState());
        dispatch(logout())
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('accessToken')
        // clearCachedQueries()
        content = "logged out"
        toast("logged out")
        navigate('/')
    } else if(isError){
        content = error.message
        toast(error.message)
    }
    
      
    
    
   
   
    return (
        <Box>{content}</Box>
    )
}
