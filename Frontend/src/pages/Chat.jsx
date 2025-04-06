import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import { TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'
import Sidebar1 from "../components/Sidebar1";
import NavChat from "../components/NavChat.jsx";
import InputBox from "../components/InputBox.jsx";
import ChatComponent from "../components/ChatComponent.jsx";
import edit from '../assets/edit.png'
import tick from '../assets/tick.png'



export default function ChatApp() {


  const { navigate, sendMessage, chatHistory, setChatHistory, conversations, conversationId, setConversationId, message, setMessage, clearConversation, fetchingHistory, setFetchingHistory, fetchHistory, deleteCoversation, fetchUserHistory, loading, updateConversationName, editingId, setEditingId, setNewName, newName,handleSelectConversation } = useContext(AppContext);
  const [hoverIndex, setHoverIndex] = useState(null);

  


  const startEditing = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const saveNewName = (id) => {
    updateConversationName(id, newName);
    setEditingId(null);
  };


  useEffect(() => {
    if (conversationId === null) {
      setChatHistory([]);
    } else {
      fetchHistory(conversationId);
    }
  }, [conversationId]);



  return (

    <>
      <NavChat setConversationId={setConversationId} setChatHistory={setChatHistory} fetchUserHistory={fetchUserHistory} conversations={conversations} handleSelectConversation={handleSelectConversation} deleteCoversation={deleteCoversation} clearConversation={clearConversation} />

      <div className="flex h-screen mt-10 bg-white  bg-study-theme bg-cover bg-center mr-1 chat-container">

        {/* Sidebar for Conversation History */}

        <div className="w-[30%] overflow-auto py-5 hidden sm:flex flex-col border-2 border-r-gray-300">

          <div className="md:flex hidden justify-center">
            <Sidebar1 />
          </div>


          <div className=" p-4 h-auto  bg-gray-50 shadow-lg hover:shadow-2xl  rounded-lg ml-5 lg:mx-10 mt-5 mr-5">
            <div className="flex justify-center items-center">
              <h2 className="text-lg font-bold mb-4">Recent Searches</h2>
            </div>

            {conversations.length > 0 ? (
              conversations.map((chat) => (
                <div
                  key={chat._id}
                  className="p-2 border mb-2 cursor-pointer hover:bg-gray-200 flex flex-wrap justify-between items-center border-gray-200 gap-2 sm:gap-4 md:gap-6 lg:gap-8 rounded-lg"
                >
                  {/* Left Section - Conversation Name */}
                  <div
                    onClick={() => handleSelectConversation(chat._id)}
                    className="flex-1 min-w-[150px]" // Ensures text doesn't shrink too much
                  >
                    {editingId === chat._id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border p-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-700 truncate">
                        {chat.topicName || "Untitled Conversation"}
                      </p>
                    )}
                  </div>

                  {/* Right Section - Icons */}
                  <div className="flex gap-2 items-center">
                    {editingId === chat._id ? (

                      <img src={tick} className="h-5 w-5 text-green-500 cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:brightness-110" alt="" onClick={() => saveNewName(chat._id)} />
                    ) : (
                      <img src={edit} alt="" className="h-5 w-5 text-blue-500 cursor-pointer" onClick={() => startEditing(chat._id, chat.topicName)} />

                    )}
                    <div onClick={() => deleteCoversation(chat._id)}>
                      <TrashIcon className="h-5 w-5 hover:rotate-12 transition-transform duration-200 cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center">
                <p className="border border-gray-400 px-4 py-2 text-gray-500 rounded-full">
                  No previous conversations
                </p>
              </div>
            )}

            <div className="flex items-center justify-center">
              <button onClick={clearConversation} className="mt-4 px-2 py-1 bg-red-500 text-white md:w-[80%] md:rounded-full sm:rounded-3xl
           ">
                Clear Conversation
              </button>
            </div>
          </div>
        </div>




        {/* Chat Area and Quiz Area */}


        <div className="w-full sm:w-3/4 p-4 flex flex-col justify-between mt-5 h-[90%] ">

          <ChatComponent hoverIndex={hoverIndex} setHoverIndex={setHoverIndex} chatHistory={chatHistory} loading={loading} fetchUserHistory={fetchUserHistory} />
          <InputBox sendMessage={sendMessage} message={message} setMessage={setMessage} chatHistory={chatHistory} />

        </div>
      </div>
    </>

  );
}
