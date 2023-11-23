const jwt = require('jsonwebtoken')

const generateToken = async (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1m' })
    await res.cookie('jwt', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development' || true,
        sameSite: 'strict',
        maxAge: 6 * 30 * 24 * 60 * 60 * 1000
    })
}

module.exports = {generateToken}