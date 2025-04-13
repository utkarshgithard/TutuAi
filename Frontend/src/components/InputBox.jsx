import React, { useContext } from 'react'
import send from '../assets/send.png'
import resource from '../assets/books.png'
import { AppContext } from '../Context/AppContext'

const InputBox = ({ sendMessage, message, setMessage }) => {
    const { generateResources } = useContext(AppContext);
    return (
        <div className="relative w-full mt-4">
            <textarea
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 p-2 pr-12 border rounded-lg border-gray-300 outline-none resize-none"
                placeholder="Type a message..."
            />
            
            <button
                onClick={sendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2  p-2 "
            >
                <img src={send} alt="Send" className="h-7 w-7" />
            </button>
            <button
               
                className="absolute left-2 bottom-3 text-gray-400 hover:text-gray-600 border-gray-400 border rounded-full px-2 flex items-center gap-2 hover:border-gray-400"
                title="Get Study Resources"
                onClick={generateResources}
            >
                <img src={resource} alt="" className='h-4 w-4'/>
                <p>Resource</p> 
            </button>
        </div>
    )
}

export default InputBox
