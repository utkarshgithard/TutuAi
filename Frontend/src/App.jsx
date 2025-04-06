import React, { useContext } from 'react'
import Home from './pages/home'
import { Routes,Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import { ToastContainer,toast } from 'react-toastify'
import Quiz from './pages/Quiz'
import { AppContext } from './Context/AppContext'


function App() {
  
  return (
    <div  >
      <ToastContainer/>
      
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path='/quiz' element={<Quiz/>}/>
      </Routes>

    </div>
  )
}

export default App
