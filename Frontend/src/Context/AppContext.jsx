import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setToken] = useState();
    const [visible, setVisible] = useState(false)
    const [makeQuiz, setMakeQuiz] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);
    const [selectedChatHistory, setSelectedChatHistory] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");
    const [userName, setUserName] = useState('')
    const [googleloginLoading,setgoogleloginLoading] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [showSelectedChatHistory, setShowSelectedChatHistory] = useState(null);
    const [resources,setResources] = useState(null);


    const handleSelectChatHistory = (chatId) => {
        fetchHistory(chatId);
        console.log("Button Clicked.")
    }
    const handleSelectConversation = (chatId) => {
        setConversationId(chatId);
        fetchHistory(chatId);
        navigate(`/chat/${chatId}`);
    };
    

    const clearConversation = async () => {
        if (!conversationId) return;
        try {
            await axios.delete(backendURL+'/api/v1/clear-conversation', {
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

    const fetchUserHistory = async () => {
        try {
            const res = await axios.get(backendURL+'/api/v1/getUserHistory', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUserName(res.data.name)
            setConversations(res.data.conversations || []);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };


    const deleteCoversation = async (id) => {
        try {
            await axios.delete(`${backendURL}/api/v1/deleteConversation/${id}`)

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
            const res = await axios.post(backendURL+
                '/api/v1/conversation-history',
                { conversationId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            console.log(res)

            const formattedChat = res.data.map(chat => [
                { role: "user", content: chat.userMessage },
                { role: "bot", content: chat.botResponse }
            ]).flat(); // Flatten the array to maintain sequence

            setChatHistory(formattedChat);

            setSelectedChatHistory(formattedChat);
        } catch (error) {
            console.error("Error fetching history:", error);
            setSelectedChatHistory([])
            setChatHistory([]);
        } finally {
            setFetchingHistory(false);
        }
    };
    const generateResources  = async()=>{
        try {
            const res = await axios.post(
                backendURL+'/api/v1/resource',
                {chatHistory},{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            console.log(res);

            if (res.data.resources) {
                setResources(res.data.resources);
                console.log(res.data.resources)
              } else {
                setError("Failed to generate quiz.");
            }
            setChatHistory((prevChat) => [...prevChat, { role: "bot", content: res.data.resources ,type:"resource" }]);
        } catch (error) {
            console.error("Error getting response.", error);
        } finally {
            setLoading(false);
        }
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        setChatHistory((prevChat) => [...prevChat, { role: "user", content: message }]);
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(
                backendURL+'/api/v1/chat',
                { message, conversationId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const newConversationId = res.data.conversationId;


            if (!conversationId) {
                setConversationId(newConversationId);
                navigate(`/chat/${newConversationId}`);
            }
            setChatHistory((prevChat) => [...prevChat, { role: "bot", content: res.data.response }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };
    const updateConversationName = async (id, newName) => {
        try {
            const response = await axios.put(`${backendURL}/api/v1/conversations/${id}`, {
                newName
            });

            // Update UI with new name
            setConversations((prev) =>
                prev.map((chat) => (chat._id === id ? { ...chat, topicName: newName } : chat))
            );
        } catch (error) {
            console.error("Error updating name:", error);
        }

    };
    const value = { backendURL,token, setToken, navigate, visible, setVisible, makeQuiz, setMakeQuiz, sendMessage, chatHistory, setChatHistory, conversations, setConversations, conversationId, setConversationId, message, setMessage, fetchingHistory, setFetchingHistory, fetchHistory, deleteCoversation, clearConversation, fetchUserHistory, loading, selectedChatHistory, handleSelectChatHistory, updateConversationName, editingId,newName,setNewName,setEditingId,userName,setUserName,handleSelectConversation,setgoogleloginLoading,googleloginLoading,showSelectedChatHistory,setShowSelectedChatHistory,generateResources }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider