const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const helmet = require('helmet')
const authRouter = require('./routes/auth_route')
const postRouter = require('./routes/post_route')
const blogRouter = require('./routes/blog_route')
const { connectDbAndRunServer } = require('./configs/db')
const cors = require('cors')
const {authMiddleware} = require('./middleware/authMiddleware')
require('dotenv').config()


const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(cookie())
app.use(helmet())

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts",authMiddleware, postRouter);
app.use("/api/v1/blogs",authMiddleware, blogRouter);

// Health Check
app.get("/healthz", (req,res) => {
    res.status(200).json({"message":"Healthy"})
})

// db connection and server initialization
connectDbAndRunServer(app)
