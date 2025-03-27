import React, { useContext,useEffect } from 'react'
import exit from '../assets/exit.png'
import link from '../assets/link.png'
import user from '../assets/user.png'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const Sidebar1 = () => {

    const { setToken } = useContext(AppContext)
    const navigate = useNavigate();

    const logOut = () => {
        // Remove token from local storage
        localStorage.removeItem("token");
    
        // Clear token from state (if using context or redux)
        setToken(null);
    
        // Redirect to home or login page
        navigate("/");
      };
    
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // Redirect to home if no token
        }
      }, [navigate]);
    return (
        <>
            <div className="flex gap-2 ml-5 lg:mx-10 justify-center mt-10 flex-col lg:flex-row bg-gray-50 p-2 rounded-2xl hover:shadow-lg mb-5  " >
                <div className=" border hover:cursor-pointer hover:bg-gray-200 p-2 rounded-full flex justify-center items-center gap-2 md:flex-col ">
                    <img src={user} alt="" className="h-10 w-10 rounded-full border border-black p-1 " />
                    <p>Profile</p>
                </div>
                <div className=" border hover:cursor-pointer hover:bg-gray-200 p-2 rounded-full flex justify-center items-center gap-2 md:flex-col">
                    <img src={exit} alt="" className="h-10 w-10 rounded-full border border-black p-1" onClick={logOut} />
                    <p>Logout</p>
                </div>
                <div className=" border hover:cursor-pointer hover:bg-gray-200 p-2 rounded-full flex justify-center items-center gap-2 md:flex-col">
                    <img src={link} alt="" className="h-10 w-10 rounded-full border border-black p-1 " />
                    <p>Share</p>
                </div>
            </div>
        </>
    )
}

export default Sidebar1
