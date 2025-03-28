import React, { useContext, useState, useEffect } from 'react'
import { createRoutesFromElements } from 'react-router-dom'
import axios from 'axios'
import { auth, provider, signInWithPopup } from '../firebase';
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import logo from '../assets/logoCo.png'
const Login = () => {

    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { token, setToken, navigate } = useContext(AppContext)
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (currentState === 'Signup') {
                const response = await axios.post('http://localhost:5000/api/v1/user/register', { name, email, password })
                console.log(response);
                if (response.data.success === true) {
                    localStorage.setItem('token', response.data.token)
                    setToken(response.data.token)
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.error)
                }
            } else {
                const response = await axios.post('http://localhost:5000/api/v1/user/login', { email, password })
                if (response.data.success === true) {
                    localStorage.setItem('token', response.data.token)
                    setToken(response.data.token)
                } else {
                    toast.error(response.data.error)
                }
            }
            console.log("button Clicked")

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
    const handleGoogleLogin = async () => {
        try {
            provider.setCustomParameters({ prompt: 'select_account' })
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const response = await axios.post('http://localhost:5000/api/v1/user/google-auth', { email: user.email, name: user.displayName });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                toast.success("Login successful with Google!");
            }
        } catch (error) {
            toast.error("Google login failed");
        }
    };
    useEffect(() => {
        if (token) {
            navigate('/chat')
        }
    }, [token])

    return (
        <div className='h-[100vh] w-full flex flex-col bg-gray-50'>
            <div className='flex justify-start mt-10 ml-5  flex-row items-center gap-8'>
                <div><img src={logo} className='h-21 w-20 rounded-full  ' alt="" /></div>
                <div className='text-gray-900  font-bold text-4xl '> Nebula Navigators</div>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col  items-center mt-20 '>
                <div className='flex flex-col gap-2 border border-[#D1D5DB] rounded-md px-10 py-10 bg-[#F7F9FC] hover:shadow-lg'>
                    <div>Start your journey with us</div>
                    <div className='inline-flex items-center gap-3.5'>
                        <p className='text-3xl font-bold'>{currentState} to FunStudy </p>
                        <p className='h-[2px] w-6 bg-gray-800'></p>
                    </div>


                    <hr />
                    {currentState === 'Login' ? '' :
                        <input type="text " placeholder='Enter Name ' className='border border-black rounded-md mt-4 px-4 py-2 ' value={name} onChange={(e) => setName(e.target.value)} />
                    }
                    <input type="text" placeholder='Enter Email ' className='border border-black rounded-lg mt-4 px-4 py-2 ' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder='Password ' className='border border-black rounded-lg mt-4 px-4 py-2 ' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='flex justify-between'>
                        <p className='hover:cursor-pointer '>Forgot Password?</p>
                        <p className='hover:cursor-pointer ' onClick={() => { currentState === 'Login' ? setCurrentState('Signup') : setCurrentState('Login') }}>{currentState === 'Login' ? 'Create Account' : 'login to account'}</p>
                    </div>
                    <div className='flex justify-center'>
                        <button className='bg-[#007bff] text-white mt-10 w-[40%] py-2 rounded-2xl '>{currentState}</button>

                    </div>
                </div>
            </form>
            <button type='button' onClick={handleGoogleLogin} className='bg-red-500 text-white mt-4 w-[40%] py-2 rounded-2xl'>
                Login with Google
            </button>
        </div>
    )
}

export default Login
