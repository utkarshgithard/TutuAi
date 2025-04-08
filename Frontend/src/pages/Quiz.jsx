import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import Sidebar1 from "../components/Sidebar1";
import NavChat from "../components/NavChat.jsx";
import QuizArea from '../components/QuizArea.jsx'
export default function Quiz() {



  const { setConversationId, setChatHistory, fetchUserHistory, conversations, handleSelectConversation, deleteCoversation, clearConversation, handleSelectChatHistory, selectedChatHistory,setShowSelectedChatHistory,showSelectedChatHistory } = useContext(AppContext);
  const handleClick = (id) => {
    setShowSelectedChatHistory(id);
  };
  useEffect(() => {
    fetchUserHistory();
  }, [])

  return (

    <div className="">
      <NavChat setConversationId={setConversationId} setChatHistory={setChatHistory} fetchUserHistory={fetchUserHistory} conversations={conversations} handleSelectConversation={handleSelectConversation} deleteCoversation={deleteCoversation} clearConversation={clearConversation} />

      <div className="flex  h-screen mt-10 bg-white  bg-study-theme bg-cover bg-center mr-1'">

        {/* Sidebar for Conversation History */}

        <div className=" md:w-[50%] lg:w-[40%] overflow-auto py-5 hidden md:flex flex-col border-2 border-r-gray-300">

          <div className="md:flex hidden justify-center">
            <Sidebar1 />
          </div>


          <div className=" p-4 h-auto  bg-gray-50 shadow-lg hover:shadow-2xl  rounded-lg ml-5 lg:mx-10 ">
            <div className="flex justify-center items-center">
              <h2 className="text-lg font-bold mb-4">Select Topics</h2>
            </div>

            {conversations.length > 0 ? (
              conversations.map((chat) => (
                <div
                  key={chat._id}
                  className={`p-2 border mb-2 cursor-pointerflex justify-between md:flex-row sm:flex-col items-center gap-2  md:gap-4 lg:gap-10 ${showSelectedChatHistory===chat._id ?'border border-blue-700 rounded-lg':' border hover:bg-gray-200 border-gray-200 rounded-lg'}`}
                >
                  <div onClick={() => {
                    handleSelectChatHistory(chat._id)
                    handleClick(chat._id)
                  }}  >
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {chat.topicName || "Untitled"}
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
        {/* Chat Area and Quiz Area */}

        <div className="w-full p-4 l flex-grow justify-between mt-5 h-auto ">
          <QuizArea selectedChatHistory={selectedChatHistory} />
        </div>
      </div>
    </div>

  );
}
