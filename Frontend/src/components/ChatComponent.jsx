import React, { useRef, useEffect } from 'react'
// import { marked } from 'marked'
import { copyToClipboard } from "../utils.js/copy";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import logo from '../assets/logonav.png'

const ChatComponent = ({ fetchingHistory, setHoverIndex, chatHistory, loading, fetchUserHistory }) => {


    const botMessageRef = useRef(null);
    const topRef = useRef(null);
    useEffect(() => {
        if (botMessageRef.current) {
            botMessageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [chatHistory]);
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [chatHistory]);
    useEffect(() => {
        fetchUserHistory();
    }, []);

    return (

        <>
            <div className="Chat flex-1 overflow-auto p-4 mt-4 bg-white shadow-lg border-2 border-gray-300 rounded-lg">
  {fetchingHistory ? (
    <p className="text-gray-500">Loading conversation...</p>
  ) : (
    chatHistory.map((chat, index) => (
      <div
        key={index}
        ref={chat.role === "bot" ? botMessageRef : topRef}
        className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}
        onMouseEnter={() => setHoverIndex(index)}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div
          className={`inline-block space-y-4 p-4 rounded-3xl ${
            chat.role === "user"
              ? "bg-slate-200 text-gray-900"
              : "bg-gray-50 text-gray-800 shadow-md"
          } max-w-full break-words`}
        >
          {chat.type === "resource" ? (
            <div className="space-y-4">
              {chat.content.map((item, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded-md bg-white shadow-sm"
                >
                  <h3 className="font-semibold text-blue-700">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 underline"
                    >
                      View Resource
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {chat.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Copy Button for Bot Message (Markdown only) */}
        {chat.role === "bot" && chat.type !== "resource" && (
          <button
            onClick={() => copyToClipboard(chat.content)}
            className="text-white p-1 rounded-full"
            title="Copy to Clipboard"
          >
            📋
          </button>
        )}
      </div>
    ))
  )}

  {loading && (
    <p className="text-gray-500 flex justify-start gap-2 items-center">
      <img
        src={logo}
        alt="Logo"
        className="h-5 w-5 md:h-7 md:w-7 object-contain animate-spin-fast"
      />
      Sending message...
    </p>
  )}
</div>

            <hr className="mt-5" />
        </>

    )
}

export default ChatComponent
