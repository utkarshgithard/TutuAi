import React from 'react'
import send from '../assets/send.png'

const InputBox = ({ sendMessage,message,setMessage }) => {
    return (
        <div className="relative w-full mt-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-20 p-2 pr-12 border rounded-lg border-gray-300 outline-none"
                placeholder="Type a message..."
            />
            <button
                onClick={sendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2  p-2 "
            >
                <img src={send} alt="Send" className="h-7 w-7" />
            </button>
        </div>
    )
}

export default InputBox
