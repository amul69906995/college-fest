import React, { useContext, useState } from 'react'
import { toastifyOption } from '../constant';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthProvider';
import axios from 'axios';
import { useEffect } from 'react';
const Admin = () => {
    const { user } = useContext(authContext)
    const [isFetching,setIsFetching]=useState(false)
    const[inputEmail,setInputEmail]=useState('')
    const [allVol,setAllVol]=useState([])
    const handleAdminAllowGenerateQr = async () => {
        setIsFetching(true)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/activate-fest`, {}, { withCredentials: true }
            )
            toast.success(data?.message, toastifyOption);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message, toastifyOption)
        }
        finally{
            setIsFetching(false)
        }
    }
    const handleAdminStopQrGenration=async()=>{
        setIsFetching(true)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/deactivate-fest`, {}, { withCredentials: true }
            )
            toast.success(data?.message, toastifyOption);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message, toastifyOption)
        }
        finally{
            setIsFetching(false)
        }
    }
    const handleAddVolunteer=async(e)=>{
        e.preventDefault();
        try {
            const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/make-vol`,{userEmail:inputEmail},{
                withCredentials:true
            })
            console.log(data)

        } catch (error) {
            console.log(error)
        }
       
    }
    useEffect(()=>{
   (async()=>{
    try{
        const {data}=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/all-vol`,{
            withCredentials:true
        })
        setAllVol(data)
        console.log(data)
        }catch(error){
            console.log(error)
        }
   })()
    },[])
    return (
        <>
            <button  disabled={isFetching} onClick={handleAdminAllowGenerateQr}>Allow students to generate Qr</button>
            <button disabled={isFetching}  onClick={handleAdminStopQrGenration}>stop qr genration/reset</button>
            {/* <p style={{ color: user.isAllowedForQrData ? 'green' : 'red' }}>{user.isAllowedForQrData ? "students are allowed to generate qr" : "students are not allowed to genrate qr"}</p> */}
           <form  onSubmit={handleAddVolunteer} >
            <input type="email" placeholder='add email u want to make vol' onChange={(e)=>setInputEmail(e.target.value)} required/>
            <button  type='submit'>Add volunteer</button>
            </form>
            <ul>
            {allVol.length>0&&allVol.map(vol=>{
                return <li key={vol._id}>{vol.email}</li>
            })}
            </ul>
        </>
    )
}

export default Admin;
