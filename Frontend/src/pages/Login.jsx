import React, { useContext, useState, useEffect } from 'react'
import { createRoutesFromElements } from 'react-router-dom'
import axios from 'axios'
import { auth, provider, signInWithPopup } from '../firebase';
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import logo from '../assets/logoCo.png'
import googleicon from '../assets/google-icon.png'
import click from '../assets/click.mp3'
const Login = () => {

    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { token, setToken, navigate, setUserName, userName,backendURL } = useContext(AppContext);
    const handleClick = () => {
        const clickSound = new Audio(click);
        clickSound.play();
    };
    useEffect(() => {
        console.log(userName)
    })
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(backendURL)

        try {
            if (currentState === 'Signup') {
                const response = await axios.post(backendURL+'/api/v1/user/register', { name, email, password })
                console.log(response);
                if (response.data.success === true) {
                    localStorage.setItem('token', response.data.token)
                    setToken(response.data.token)
                    toast.success(response.data.message)

                } else {
                    toast.error(response.data.error)
                }
            } else {
                const response = await axios.post(backendURL+'/api/v1/user/login', { email, password })
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
        console.log(backendURL)
        try {
            provider.setCustomParameters({ prompt: 'select_account' })
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const response = await axios.post(backendURL+'/api/v1/user/google-auth', {
                email: user.email,
                name: user.displayName,
            });
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
        <div className='h-[100vh] w-full flex flex-col bg-gray-50 items-center'>
            <div className='flex justify-center flex-row items-center gap-8'>
                <div><img src={logo} className='h-44' alt="" /></div>

            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col  items-center  Form'>
                <div className='flex flex-col gap-2 border border-[#D1D5DB] rounded-md px-10 py-4 bg-[#F7F9FC] hover:shadow-lg'>
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
                    <div className='flex justify-center' onClick={handleClick}>
                        <button className='bg-[#007bff] text-white mt-10 w-[40%] py-2 rounded-2xl '>{currentState}</button>
                    </div>
                </div>
            </form>
            <div className='flex justify-center mt-5 px-4 items-center gap-3'>
                <p className='h-[1.5px] w-40 bg-gray-400'></p>
                <p>or</p>
                <p className='h-[1.5px] w-40 bg-gray-400'></p>
            </div>
            <div onClick={handleGoogleLogin} className=' flex justify-center  text-black gap-2 border border-gray-600  mt-4 py-2 rounded-full px-2 bg-whitefont-semibold hover:cursor-pointer'>
                <img src={googleicon} alt="" className='h-8 w-8 mr-4' />
                <button className='Form' onClick={handleClick} >
                    <p>Sign in with Google</p>
                </button>
            </div>

        </div>
    )
}

export default Login
