import React, { useContext, useEffect, useState } from 'react'
import exit from '../assets/exit.png'
import link from '../assets/link.png'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'
import quiz from '../assets/quiz.png'
import { Link, useLocation } from 'react-router-dom'
import chat from '../assets/chat.png'
import click from '../assets/click.mp3'

const Sidebar1 = () => {
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const { setToken, setMakeQuiz } = useContext(AppContext)
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        const clickSound = new Audio(click);
        clickSound.play();
      };

    const logOut = () => {
        // Remove token from local storage
        localStorage.removeItem("token");

        // Clear token from state (if using context or redux)
        setToken(null);

        // Redirect to home or login page
        navigate("/");
    };
    const handleCopyLink = () => {
        const url = window.location.href; // or a custom shareable URL
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((err) => {
            console.error('Failed to copy: ', err);
          });
      };
      

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to home if no token
        }
    }, [navigate]);
    return (
        <>
            <div className="flex  md:gap-6 gap-2 md:ml-5 lg:mx-10 md:justify-center md:mt-10 flex-row sm:bg-inherit md:p-2 items-start rounded-2xl md:hover:shadow-lg mb-5   " >
                <Link to={location.pathname === '/quiz' ? '/chat':'/quiz'}>
                {location.pathname === "/quiz" ?(
                    <div className="flex-col hover:cursor-pointer hover:bg-gray-100 md:p-2 rounded-full flex justify-center items-center gap-2 md:flex-col relative group" onClick={handleClick}>
                    <img src={chat} alt="" className="md:h-10 md:w-10 h-8 w-8  md:p-1 " title='Assistance'/>
                    <p  className='text-xs text-red-400'>Chat</p>
                   
                </div>
                ):(<div  className="flex-col hover:cursor-pointer hover:bg-gray-100 md:p-2 rounded-full flex justify-center items-center gap-2 md:flex-col relative group"onClick={handleClick}>
                    <img src={quiz} alt="" className="md:h-10 md:w-10 h-8 w-8 md:p-1 " title='Create Quiz'/>
                    <p className='text-xs text-red-400'>Quiz</p>
                   
                </div>)}
                    
                </Link>

                <div onClick={handleCopyLink} className=" flex-col hover:cursor-pointer hover:bg-gray-100 md:p-2 rounded-full flex justify-center items-center gap-2 md:flex-col relative group">
                    <img src={link} alt="" className="md:h-10 md:w-10 h-8 w-8  md:p-1 " title = "Share Link" />
                    <p className='text-xs text-red-400'>Share</p>
                </div>

                <div className="flex flex-col hover:cursor-pointer hover:bg-gray-100 md:p-2 rounded-full  justify-center items-center gap-2 md:flex-col relative group" onClick={handleClick}>
                    <img src={exit} alt="" className="md:h-10 md:w-10 h-8 w-8 md:p-1" onClick={logOut} title='Logout' />
                    <p  className='text-xs text-red-400'>Logout</p>
                </div>
            </div>
        </>
    )
}

export default Sidebar1
