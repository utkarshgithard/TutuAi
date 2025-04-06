import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import ChatRouter from './Routes/chatRoutes.js'
import 'dotenv/config'
import userRouter from './Routes/userRoutes.js'
import quizRouter from './Routes/quizRouter.js'
import conversationRouter from './Routes/conversationRouter.js'
const app = express()
const PORT = process.env.PORT || 5000


// connecting database
mongoose.connect(`${process.env.MONGO_URI}/ChatAPP`)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/v1',ChatRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/quiz',quizRouter)
app.use('/api/v1',conversationRouter)

app.get('/',(req,res)=>{
    console.log("api Working")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
