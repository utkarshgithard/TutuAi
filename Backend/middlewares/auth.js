import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization; // Get Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ message: 'Token Not found', success: false });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
    // const { token } = req.headers

    console.log("Received Token:", token);

    try {
        console.log('Hi')
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", token_decoded);
        console.log(token_decoded);
        req.body.userId = token_decoded.userId; // Attach userId to request body
        console.log(req.body.userId)
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
