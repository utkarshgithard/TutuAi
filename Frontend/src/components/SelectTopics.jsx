import React from 'react'

const SelectTopics = () => {
    return (
        <>
            <div className=" p-4 h-auto  bg-gray-50 shadow-lg hover:shadow-2xl  rounded-lg ml-5 lg:mx-10 ">
                <div className="flex justify-center items-center">
                    <h2 className="text-lg font-bold mb-4">Recent Searches</h2>
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
                
            </div>

        </>
    )
}

export default SelectTopics
