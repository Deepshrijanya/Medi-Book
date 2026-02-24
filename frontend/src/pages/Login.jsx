import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')


  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {

        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }


      }
    } catch (error) {

      toast.error(error.message)

    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-6 m-auto items-start p-10 min-w-[340px] sm:min-w-96 bg-ivory border border-teal_tint rounded-[20px] text-text_secondary text-sm shadow-2xl'>
        <p className='text-3xl font-bold text-text_primary'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p className='text-sm font-medium'>Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment</p>
        {
          state === "Sign Up" && <div className='w-full'>
            <p className='font-bold text-text_primary mb-1'>Full Name</p>
            <input className='bg-white border border-teal_tint rounded-xl w-full p-3 mt-1 outline-none focus:border-primary transition-all font-medium' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </div>
        }

        <div className='w-full'>
          <p className='font-bold text-text_primary mb-1'>Email</p>
          <input className='bg-white border border-teal_tint rounded-xl w-full p-3 mt-1 outline-none focus:border-primary transition-all font-medium' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div>

        <div className='w-full'>
          <p className='font-bold text-text_primary mb-1'>Password</p>
          <input className='bg-white border border-teal_tint rounded-xl w-full p-3 mt-1 outline-none focus:border-primary transition-all font-medium' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-primary text-white w-full py-3.5 rounded-xl text-base font-bold shadow-lg hover:bg-secondary transition-all active:scale-95 mt-2'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
        {
          state === "Sign Up"
            ? <p className='mt-2 font-medium'>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-bold underline cursor-pointer'>Login here</span></p>
            : <p className='mt-2 font-medium'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-primary font-bold underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
