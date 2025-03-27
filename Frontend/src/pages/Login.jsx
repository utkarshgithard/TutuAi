import React, { useContext, useState,useEffect } from 'react'
import { createRoutesFromElements } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'

const Login = () => {

    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {token ,setToken ,navigate} =useContext(AppContext)
    const onSubmitHandler = async(e)=>{
        e.preventDefault();

        try {
            if(currentState === 'Signup'){
                const response = await axios.post('http://localhost:5000/api/v1/user/register',{name,email,password})
                console.log(response);
                if(response.data.success === true){
                    localStorage.setItem('token',response.data.token)
                    setToken(response.data.token)
                    toast.success(response.data.message)
                }else{
                   toast.error(response.data.error)
                }
            }else{
                const response = await axios.post('http://localhost:5000/api/v1/user/login',{email,password})
                if(response.data.success === true){
                    localStorage.setItem('token',response.data.token)
                    setToken(response.data.token)
                }else{
                    toast.error(response.data.error)
                }
            }
            console.log("button Clicked")
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
        
    }

   useEffect(()=>{
        if(token){
            navigate('/chat')
        }
   },[token])

    return (
        <div className='h-screen w-full flex flex-col'>
            <div className='flex justify-start mt-10 ml-5'>
                <div>logo</div>
                <div>Company name</div>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col h-80 items-center mt-20 '>
                <div className='flex flex-col gap-2 border border-gray-950 rounded-md px-10 py-10'>
                    <div>Start your journey with us</div>
                    <div className='inline-flex items-center gap-3.5'>
                        <p className='text-3xl font-bold'>{currentState} to FunStudy </p>
                        <p className='h-[2px] w-6 bg-gray-800'></p>
                    </div>


                    <hr />
                    {currentState === 'Login' ? '' :
                        <input type="text " placeholder='Enter Name ' className='border border-black rounded-md mt-4 px-4 py-2 ' value={name} onChange={(e)=>setName(e.target.value)} />
                    }
                    <input type="text" placeholder='Enter Email ' className='border border-black rounded-lg mt-4 px-4 py-2 ' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="text" placeholder='Password ' className='border border-black rounded-lg mt-4 px-4 py-2 ' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <div className='flex justify-between'>
                        <p className='hover:cursor-pointer '>Forgot Password?</p>
                        <p className='hover:cursor-pointer ' onClick={() => {currentState === 'Login'?setCurrentState('Signup'):setCurrentState('Login')}}>{currentState === 'Login'?'Create Account':'login to account'}</p>
                    </div>
                    <div className='flex justify-center'>
                        <button className='bg-gray-900 text-white mt-10 w-[40%] py-2 rounded-2xl '>{currentState}</button>
                    </div>
                    
                </div>


            </form>
        </div>
    )
}

export default Login
