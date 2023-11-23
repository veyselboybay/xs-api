const jwt = require('jsonwebtoken')
const User = require('../models/user')


const authMiddleware = async (req, res, next) => {
    let token;
    try {
        token = req.headers.authorization;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.userId).select('-password')
                if (user) {
                    req.user = user
                    next()
                } else {
                    return res.status(401).json({success:false,msg:'User does not exist'})
                }
            } catch (error) {
                res.status(401);
                throw new Error('Not Authorized, invalid token.')
            }
        } else {
            res.status(401);
            throw new Error('Not Authorized, no token')
        }
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

module.exports = {authMiddleware}