import React, { useContext, useEffect } from 'react'
import menu from '../assets/menu.png'
import back from '../assets/back.png'
import newPage from '../assets/new-page.png'
import { AppContext } from '../Context/AppContext'
import { TrashIcon } from '@heroicons/react/24/outline'
import Sidebar1 from './Sidebar1'
import { Link, useLocation } from 'react-router-dom'
import edit from '../assets/edit.png'
import tick from '../assets/tick.png'
import { Typewriter } from 'react-simple-typewriter'
import logo from '../assets/logonav.png'
const NavChat = ({ setConversationId, setChatHistory, fetchUserHistory, conversations, handleSelectConversation, deleteCoversation, clearConversation, handleSelectChatHistory }) => {

    const location = useLocation()
    const { navigate, visible, setVisible, editingId, newName, setNewName, setEditingId, userName, updateConversationName, conversationId } = useContext(AppContext)

    const startEditing = (id, currentName) => {
        setEditingId(id);
        setNewName(currentName);
    };

    const saveNewName = (id) => {
        updateConversationName(id, newName);
        setEditingId(null);
    };
    const newQuiz = () => {
        // Example logic: navigate to quiz creation page or reset quiz state
        navigate("/quiz/new"); // if using react-router
    };

    const newChat = async () => {
        setConversationId(null);
        setChatHistory([]);
        navigate('/chat');
        await fetchUserHistory();
    }
    useEffect(() => {
        console.log(visible)
    }, [])
    return (
        <div className={`bg-white h-20 md:${'h-14'} px-2 navHead items-center pt-1 fixed top-0 left-0 w-full z-50 flex justify-between border-b-gray-300 border-2 pr-7 `}>
            <div className="flex items-center gap-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 md:h-12 md:w-12 object-contain animate-spin-fast"
                />
                <div className="flex flex-col animate-spin-slow">
                    <span className="text-gray-500 text-sm md:text-base">Hi,</span>
                    <span className="font-bold text-md md:text-2xl text-gray-800">{userName}</span>
                </div>
            </div>


            <div className='flex h-[100%] justify-between gap-2 mt-5'>
                <div className='md:hidden '>
                    <Sidebar1 />
                </div>

                <div className="relative group h-[100%] ">

                    {location.pathname.startsWith('/chat') ? (
                        <>
                            <img
                                className="h-8 w-8 cursor-pointer"
                                src={newPage}
                                alt=""
                                onClick={newChat}
                            />
                            <span className="absolute left-1/2 translate-x-[-100%]  scale-0 whitespace-nowrap rounded-lg bg-gray-600 text-white px-3 py-1 text-sm shadow-lg group-hover:scale-100 ">
                                New Chat
                            </span>
                        </>

                    ) : ('')}

                </div>
                <div className={`flex gap-3 ${location.pathname === '/quiz' ? 'hidden' : ''}`} >
                    <img src={menu} className='h-8 w-8 sm:hidden cursor-pointer' onClick={() => setVisible(true)} />

                </div>
                {location.pathname.startsWith('/chat') ? (<div className={`md:hidden absolute top-0 right-0 bottom-0 h-screen overflow-hidden transition-all ${visible ? 'w-full' : 'w-0'} z-50`}>
                    <div className='flex flex-col text-gray-700 '>
                        <div onClick={() => setVisible()}>
                            <img className='h-4 rotate-180 cursor-pointer' src={back} alt="" />
                            <p className='cursor-pointer' >Back</p>

                        </div>
                        <div className='flex flex-col gap-4 mt-3'>
                            <div className={` absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} `}>
                                <div className='flex flex-col text-gray-700 '>
                                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 '>
                                        <img className='h-4 rotate-180 cursor-pointer' src={back} alt="" />
                                        <p className='cursor-pointer' >Back</p>

                                    </div>
                                    <div className='flex flex-col gap-4 mt-3 items-center'>
                                        <div className="flex justify-center items-center">
                                            <h2 className="text-lg font-bold mb-4">Recent Searches</h2>
                                        </div>

                                        {conversations.length > 0 ? (
                                            conversations.map((chat) => (
                                                <div key={chat._id} className={`p-2 border mb-2 cursor-pointer hover:bg-gray-200 flex justify-between md:flex-row items-center gap-2 border-gray-400 w-5/6  md:gap-4 lg:gap-10 rounded-lg  ${conversationId === chat._id
                                                    ? 'bg-blue-100 border-blue-400 shadow-md'
                                                    : 'hover:bg-gray-200 border-gray-200'}`} onClick={ () => {
                                                        handleSelectConversation(chat._id);
                                                        setVisible(true);
                                                    }}  >
                                                    <div className='flex justify-between'  >

                                                        {editingId === chat._id ? (
                                                            <input
                                                                type="text"
                                                                value={newName}
                                                                onChange={(e) => setNewName(e.target.value)}
                                                                className="border p-1 rounded w-full"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <p className={`text-sm font-semibold text-gray-700 truncate`}>
                                                                {chat.topicName}
                                                            </p>
                                                        )}

                                                    </div>
                                                    <div className="flex gap-2 items-center ">
                                                        {editingId === chat._id ? (
                                                            <img src={tick} className="h-5 w-5 text-green-500 cursor-pointer" alt="" onClick={() => saveNewName(chat._id)} />
                                                        ) : (
                                                            <img src={edit} alt="" className="h-5 w-5 text-blue-500 cursor-pointer" onClick={() => startEditing(chat._id, chat.topicName)} />
                                                        )}
                                                        <div onClick={() => deleteCoversation(chat._id)} >
                                                            <TrashIcon className="h-5 w-5 hover:rotate-12 transition-transform duration-200 cursor-pointer" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (

                                            <div className="flex justify-center items-center">
                                                <p className="border border-gray-400 sm:px-4 text-gray-500 md:rounded-full md:p-2 rounded-3xl ">No previous conversations</p>
                                            </div>

                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>) : (<div className={`md:hidden absolute top-0 right-0 bottom-0 h-screen overflow-hidden transition-all ${visible ? 'w-full' : 'w-0'} z-50`}>
                    <div className='flex flex-col text-gray-700 '>
                        <div onClick={() => setVisible(true)}>
                            <img className='h-4 rotate-180 cursor-pointer' src={back} alt="" />
                            <p className='cursor-pointer' >Back</p>

                        </div>
                        <div className='flex flex-col gap-4 mt-3'>
                            <div className={` absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} `}>
                                <div className='flex flex-col text-gray-700 '>
                                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 '>
                                        <img className='h-4 rotate-180 cursor-pointer' src={back} alt="" />
                                        <p className='cursor-pointer' >Back</p>

                                    </div>
                                    <div className='flex flex-col gap-4 mt-3 items-center'>
                                        <div className="flex justify-center items-center">
                                            <h2 className="text-lg font-bold mb-4">Select Topic</h2>
                                        </div>

                                        {conversations.length > 0 ? (
                                            conversations.map((chat) => (
                                                <div
                                                    key={chat._id}
                                                    className="p-2 border mb-2 cursor-pointer hover:bg-gray-200 flex justify-between md:flex-row sm:flex-col items-center gap-2 border-gray-400 w-5/6  md:gap-4 lg:gap-10 rounded-lg"
                                                >
                                                    <div className='flex justify-between' onClick={() => handleSelectChatHistory(chat._id)}>


                                                        <p className="text-sm font-semibold text-gray-700 truncate">
                                                            {chat.topicName}
                                                        </p>


                                                    </div>

                                                </div>
                                            ))
                                        ) : (

                                            <div className="flex justify-center items-center">
                                                <p className="border border-gray-400 sm:px-4 text-gray-500 md:rounded-full md:p-2 rounded-3xl ">No previous conversations</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>


    )
}

export default NavChat
