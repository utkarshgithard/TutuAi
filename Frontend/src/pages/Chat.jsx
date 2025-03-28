import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

import { TrashIcon } from '@heroicons/react/24/outline'
import send from '../assets/send.png'

import addIcon from '../assets/add.png'
import Sidebar1 from "../components/Sidebar1";
import { marked } from 'marked'
import { copyToClipboard } from "../utils.js/copy";



export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const { navigate } = useContext(AppContext);
  const { token } = useContext(AppContext)
  const [hoverIndex, setHoverIndex] = useState(null); // Track hovered index


  const botMessageRef = useRef(null);

  useEffect(() => {
    if (botMessageRef.current) {
      botMessageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chatHistory]);


  // Fetch all past conversations
  const fetchUserHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/getUserHistory", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setConversations(res.data.conversations || []);
      console.log(res.data.conversations)
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
  useEffect(() => {

    fetchUserHistory();
  }, []);

  const deleteCoversation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/deleteConversation/${id}`)

      setConversations((prevConversations) => prevConversations.filter(chat => chat._id !== id));

    } catch (error) {
      console.log('Error Deleting conversation:', error)
      alert('Failed To delete')
    }
  }

  // Fetch conversation history
  const fetchHistory = async (conversationId) => {
    setFetchingHistory(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/conversation-history",
        { conversationId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log(res)

      const formattedChat = res.data.map(chat => [
        { role: "user", content: chat.userMessage },
        { role: "bot", content: chat.botResponse }
      ]).flat(); // Flatten the array to maintain sequence

      setChatHistory(formattedChat);
    } catch (error) {
      console.error("Error fetching history:", error);
      setChatHistory([]);
    } finally {
      setFetchingHistory(false);
    }
  };

  // Start functionality 
  const newChat = async () => {
    setConversationId(null);
    setChatHistory([]);
    navigate('/chat');
    await fetchUserHistory();
  }
  useEffect(() => {
    if (conversationId === null) {
      setChatHistory([]); // Ensure old messages disappear
    } else {
      fetchHistory(conversationId);
    }
  }, [conversationId]);



  // Load history when a conversation is selected
  const handleSelectConversation = (chatId) => {
    setConversationId(chatId);
    fetchHistory(chatId);
    navigate(`/chat/${chatId}`);
  };




  // Send message function
  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory((prevChat) => [...prevChat, { role: "user", content: message }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/chat",
        { message, conversationId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const newConversationId = res.data.conversationId;


      if (!conversationId) {
        setConversationId(newConversationId);
        navigate(`/chat/${newConversationId}`);
      }
      console.log(res.data.response);

      setChatHistory((prevChat) => [...prevChat, { role: "bot", content: res.data.response }]);
      console.log(chatHistory)
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text) => {
    try {
      const ttsResponse = await axios.post("http://localhost:5000/api/tts/convert", { text });
      console.log(ttsResponse)
      const audioUrl = ttsResponse.data.audio;
      const audio = new Audio(audioUrl);
      console.log(audio)
      console.log('Audio URL:', audioUrl);
      audio.play();
      console.log("Audio is playing...");
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };
  


  // Clear conversation history
  const clearConversation = async () => {
    if (!conversationId) return;
    try {
      await axios.delete("http://localhost:5000/api/v1/clear-conversation", {
        data: { conversationId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChatHistory([]);
      setConversationId(null);
      setConversations([]); // Reset conversation list
    } catch (error) {
      console.error("Error clearing conversation:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-200  bg-study-theme bg-cover bg-center mr-1'">
      {/* Sidebar for Conversation History */}

      <div className="w-2/5 overflow-auto my-5 flex flex-col ">
        <div className="flex ml-5 bg-green-500 text-white py-1 px-1 rounded-full lg:mx-10">
          <img src={addIcon} alt="" />
          <button onClick={newChat}>Start New Chat</button>
        </div>

        <Sidebar1 />
        <div className=" p-4 h-auto  bg-gray-50 shadow-lg hover:shadow-2xl  rounded-lg ml-5 lg:mx-10 ">
          <div className="flex justify-center items-center">
            <h2 className="text-lg font-bold mb-4">Conversation History</h2>
          </div>

          {conversations.length > 0 ? (
            conversations.map((chat) => (
              <div
                key={chat._id}
                className="p-2 border mb-2 cursor-pointer hover:bg-gray-200 flex justify-between md:flex-row sm:flex-col items-center gap-2 border-gray-200 md:gap-4 lg:gap-10 rounded-lg"

              >
                <div onClick={() => handleSelectConversation(chat._id)}>

                  <p className="text-sm text-gray-600">Latest: {chat.latestMessage}</p>
                </div>
                <div onClick={() => deleteCoversation(chat._id)} >
                  <TrashIcon className="h-5 w-5 hover:rotate-12 transition-transform duration-200 cursor-pointer" />
                </div>

              </div>
            ))
          ) : (

            <div className="flex justify-center items-center">
              <p className="border border-gray-400 sm:px-4 text-gray-500 md:rounded-full md:p-2 rounded-3xl ">No previous conversations</p>
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




      {/* Chat Area */}
      <div className="w-3/4 p-4 flex flex-col justify-between ">
        <div className="flex-1 overflow-auto p-4 bg-white shadow-lg border-2 border-gray-300  rounded-lg ">
          {fetchingHistory ? (
            <p className="text-gray-500">Loading conversation...</p>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} ref={chat.role === "bot" ? botMessageRef : null} className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}>
                <p
                  className={`inline-block p-4 rounded-3xl ${chat.role === "user" ? "bg-slate-100 text-gray-900" : "bg-gray-300"}`}
                  dangerouslySetInnerHTML={{ __html: marked.parse(chat.content) }}
                />
                {/* Copy Button on Hover */}
                {/* Copy Button for Bot Response */}
                {chat.role === "bot" && (
                  <button
                    onClick={() => copyToClipboard(chat.content)}
                    className="bg-gray-500 text-white p-1 rounded-full hover:bg-gray-700"
                    title="Copy to Clipboard"
                  >
                    📋
                  </button>
                )}
                {chat.role === "bot" && (
                  <button onClick={() => playAudio(chat.content)}>🔊 Play</button>
                )}


              </div>
            ))
          )}
          {loading && <p className="text-gray-500">Sending message...</p>}
        </div>

        {/* Input Field */}
        <div className="mt-4 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="ml-2 p-2 bg-green-500 text-white rounded-full" >
            <img src={send} alt="" className="h-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
