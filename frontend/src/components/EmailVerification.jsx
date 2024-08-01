import React, { useEffect, useState } from 'react'
import { toastifyOption } from '../constant';
import { toast } from 'react-toastify';
import axios from 'axios'

const EmailVerification = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const [isVerified,setIsVerified]=useState(false)
    const [onLoading, setOnLoading] = useState(true);
    const verifyEmail=async ()=>{
        try {
            const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/verify-user`,{token})
            console.log(result)
            toast.success(result.data.message,toastifyOption);
            setIsVerified(true)
          }
          catch (e) {
            console.log(e)
            toast.error(e.response.data.message,toastifyOption)
         }
          setOnLoading(false)
        }
    useEffect(()=>{
  verifyEmail()
    },[])
   
    
  return (
    <div>
    
    {onLoading&&!isVerified&&<h1>verifying...</h1>}
       {isVerified?<h1>verified</h1>:<h1>not verified/user is already verified</h1>}
    </div>
  )
}

export default EmailVerification;