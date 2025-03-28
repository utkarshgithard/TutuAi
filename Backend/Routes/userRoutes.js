import express from 'express'
import userModel from '../Models/userModal.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userRouter = express.Router();

userRouter.post('/google-auth', async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ success: false, error: 'Email and name are required' });
    }

    try {
        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({ 
                name, 
                email, 
                isGoogleUser: true 
            });
        }

        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token: jwtToken, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});




userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET)

        res.status(201).json({ success: true, message: "User registered successfully", user: newUser, token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export default userRouter;
