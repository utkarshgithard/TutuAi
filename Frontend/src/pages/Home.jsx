import React from 'react'
import homep1 from '../assets/p5.png'
import WhyUseFunStudy from '../components/Card'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <>
            <Navbar/>
            <div className='h-screen w-100vw flex flex-col ' id='home' >
                <div className='flex justify-end px-8 mt-4'>
                    <button className='border border-blue-800 px-4 py-1 bg-gray-950 text-white font-mono text-md rounded-md' >Login</button>
                </div>
                <div className='flex mt-20 mx-10 gap-8'>
                    <div className='flex flex-col justify-center items-center gap-4'>
                        <h3 className='text-2xl font-mono '>"Revolutionizing Learning with AI-Powered Chat & 3D Visuals!"</h3>
                        <div className='flex flex-col justify-end'>

                            <Link to={'/login'} className="font-mono font-medium border px-6 py-3 border-black rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-700 hover:scale-105 active:scale-95">
                                Get Started 🚀
                            </Link>

                        </div>

                    </div>
                    <img className='' src={homep1} alt="" />
                </div>
                <div>
                    <WhyUseFunStudy />
                </div>
                <div>
                    <Footer/>
                </div>
            </div>
            
        </>

    )
}

export default Home
