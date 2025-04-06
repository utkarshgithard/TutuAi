import React, { useRef, useEffect } from 'react'
// import { marked } from 'marked'
import { copyToClipboard } from "../utils.js/copy";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";


const ChatComponent = ({ fetchingHistory, setHoverIndex, chatHistory, loading, fetchUserHistory }) => {


    const botMessageRef = useRef(null);
    useEffect(() => {
        if (botMessageRef.current) {
            botMessageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [chatHistory]);
    useEffect(() => {
        fetchUserHistory();
    }, []);

    return (

        <>
            <div className=" Chat flex-1 overflow-auto p-4 mt-8 bg-white shadow-lg border-2 border-gray-300 rounded-lg ">
                {fetchingHistory ? (
                    <p className="text-gray-500">Loading conversation...</p>
                ) : (
                    chatHistory.map((chat, index) => (
                        <div key={index} ref={chat.role === "bot" ? botMessageRef : null} className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}>
                            <div className={`inline-block space-y-4 p-4 rounded-3xl ${chat.role === "user"
                                ? "bg-slate-200 text-gray-900"
                                : "bg-gray-50 text-gray-800 shadow-md"} max-w-full break-words`}><ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]} // Enables syntax highlighting
                                >
                                    {chat.content}
                                </ReactMarkdown></div>

                            {/* Copy Button on Hover */}
                            {/* Copy Button for Bot Response */}
                            {chat.role === "bot" && (
                                <button
                                    onClick={() => copyToClipboard(chat.content)}
                                    className=" text-white p-1 rounded-full "
                                    title="Copy to Clipboard"
                                >
                                    📋
                                </button>
                            )}
                        </div>
                    ))
                )}
                {loading && <p className="text-gray-500">Sending message...</p>}
            </div>
            <hr className="mt-5" />
        </>

    )
}

export default ChatComponent
