import React, { useContext, useState } from 'react'
import { toastifyOption } from '../constant';
import { toast } from 'react-toastify';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthProvider';



const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [onLoading, setOnLoading] = useState(false)
  const { isLoading, isAuth, setIsAuth, user, setUser } = useContext(authContext)

  const navigate = useNavigate();
  const handleLogin = async () => {
    setOnLoading(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/log-in`, { email, password },
        {
          withCredentials: true,
        }
      )
      console.log(data)
      setIsAuth(true)
      setUser(data.user)
      localStorage.setItem('jwtToken',data.jwtToken)
      navigate('/protected/profile');
     /*toast.success(data?.message, toastifyOption);*/

    } catch (e) {
      console.log(e)
      toast.error(e.response?.data?.message, toastifyOption)
    }
    setOnLoading(false)
  }
  console.log(isLoading, "inside login")
  if (isLoading) return <h1>Loading...</h1>
  else {
    return (
      <div>
        <h1>log in</h1>
        <label htmlFor="email">Email</label>
        <input type="text" name='email' id="email" placeholder='xyz@gmail.com' onChange={(e) => setEmail(e.target.value)} /><br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" placeholder='**********' onChange={(e) => setPassword(e.target.value)} />
        <button disabled={onLoading} onClick={handleLogin}>Login</button>
        <Link to='/signin'><button>sign in</button></Link>
      </div>
    )
  }
}

export default Login;