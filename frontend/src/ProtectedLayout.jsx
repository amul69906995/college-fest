import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { authContext } from './context/AuthProvider'
import { ToastContainer } from 'react-toastify'

const ProtectedLayout = () => {
    const {isAuth,isLoading}=useContext(authContext)
    console.log("protected layout",isAuth,isLoading)
    const navigate=useNavigate();
    useEffect(()=>{
      console.log("inside useEffect protected route")
      if(!isAuth && !isLoading){
        navigate('/')
      }
    },[isAuth,isLoading])
  return (
    <>
    <ToastContainer/>
    {isLoading ? <h1>Loading...</h1>:(isAuth ? <Outlet /> : <h1>Not Authorized</h1>)}

    </>
  )
}

export default ProtectedLayout;
