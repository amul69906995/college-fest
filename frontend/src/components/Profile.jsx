import React, { useEffect, useState } from 'react'
import { authContext } from '../context/AuthProvider'
import { useContext } from 'react'
import axios from 'axios'
import QRCode from "react-qr-code";
import Admin from './Admin';
import { toastifyOption } from '../constant';
import { toast } from 'react-toastify';
import QrVerifier from './QrVerifier'
const Profile = () => {
  const { user } = useContext(authContext)
  const [isFetching, setIsFetching] = useState(false);
  const [qrValue, setQrValue] = useState('')
  //console.log(user)
  const getQrData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/view-qr`, {
        withCredentials: true,
      })
      console.log(data)
      setQrValue(data)//need to be checked from backend
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message, toastifyOption)
    }
  }
  useEffect(() => {

    getQrData()

  }, [])
  const handleGenerateQr = async () => {
    setIsFetching(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/generate-qr`, {
        withCredentials: true,
      })
      console.log(data)
      setQrValue(data.qrData)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message, toastifyOption)

    } finally {
      setIsFetching(false)
    }
  }
  console.log(qrValue)
  return (
    <>
      <h1>Profile {user.role}</h1>
      <h2>{user.email}</h2>
      {user.role === 'admin' ? (
        <Admin />
      ) : null}
      {
        (user.role === 'admin' || user.role === 'vol')  ? (
          <QrVerifier />
        ) : null
      }
      
      <button disabled={isFetching} onClick={handleGenerateQr}>Generate Qr</button>
      {qrValue && (<div style={{ height: "auto", margin: "0 auto", maxWidth: 300, width: "100%" }}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={qrValue}
          viewBox={`0 0 256 256`}
        />
      </div>)}

    </>
  )
}

export default Profile
