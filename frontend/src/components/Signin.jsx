import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { toastifyOption } from '../constant';
import {Link} from 'react-router-dom'

const Admin = () => {
  const [showPassword, setShowPassword] = useState(true)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [onLoading, setOnLoading] = useState(false);
  const handleSendLink = async () => {
    setOnLoading(true)
    console.log("backend url",import.meta.env.VITE_BACKEND_URL)
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/sign-in`, { email, password })
      console.log(result)
      toast.success(result.data.message,toastifyOption);
    }
    catch (e) {
      console.log(e.response.data.message)
      toast.error(e.response.data.message,toastifyOption);
    }
    setOnLoading(false)
  }
  return (
    <>
      <h2>
        admin
      </h2>
      <h3>testing email:amul123@gmail.com and password:amul123@gmail.com </h3>
      <div>
        <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <input type={showPassword ? 'password' : 'text'} placeholder='password' onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Text Form" : "password Form"}</button>
        <button onClick={handleSendLink} disabled={onLoading}>send Link</button>
        <Link to='/'><button>Login</button></Link>
      </div>
    </>
  )
}

export default Admin;