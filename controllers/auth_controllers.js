const bcrypt = require('bcrypt')
const { UserSchema, loginSchema } = require("../validation/joi")
const UserModel = require("../models/user")
const { generateToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const Post = require('../models/post')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const registerController = async (req, res) => {
    // user data validation
    const { error } = UserSchema.validate(req.body)
    if (error) return res.status(400).json({ success: false, msg: error.details[0].message })
    
    // check if the user exists
    const isUser = await UserModel.findOne({ email: req.body.email })
    if (isUser) return res.status(400).json({ success: false, msg: "User already exists" })
    
    try {
        // const { username, email, password } = req.body;
        const newUser = await UserModel.create({
            ...req.body
        })
        return res.status(201).json({success:true, msg:'New User is Created'})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const loginController = async (req, res) => {
    // user data validation
    const { error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ success: false, msg: error.details[0].message })
    
    try {
        // check if the user exists
        const isUser = await UserModel.findOne({ email: req.body.email })
        if (!isUser) return res.status(401).json({ success: false, msg: 'User does not exist' })
        
        // check password
        const isValidPassword = await bcrypt.compare(req.body.password,isUser.password)
        if (isValidPassword) {
            // await generateToken(res, isUser._id);
            const token = jwt.sign({ userId: isUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            return res.status(200).json({
                success: true,
                id: isUser._id,
                username: isUser.username,
                token: token,
                msg:'User Logged In Successfully'
            });
        } else {
            return res.status(401).json({success:false,msg:'Invalid email or password'})
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const logoutController = async (req, res) => {
    try {
        // await res.cookie("jwt", "", {
        //     httpOnly: true,
        //     expires: new Date(0)
        // })
        return res.status(200).json({success:true,msg:"logged out user"})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const getProfileController = async (req, res) => {
    // const id = req.params.id;
    try {
        const id = req.user._id;
        const user = await UserModel.findOne({ _id: id }).select('-password');
        if (user) {
            return res.status(200).json({success: true, msg: 'Success',user: user})
        } else {
            return res.status(401).json({success: false, msg:'user does not exists'})
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const getUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findOne({ _id: id }).select('-password');
        if (user) {
            return res.status(200).json({success:true,msg:'Success',user:{id:user._id,username:user.username,school:user.school}})
        } else {
            return res.status(401).json({success: false, msg:'user does not exists'})
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const updateProfileController = async (req, res) => {
    // const id = req.params.id;
    try {
        const id = req.user._id;
        const user = await UserModel.findOne({ _id: id });
        if (user) {
            await UserModel.findOneAndUpdate({ _id: user._id }, req.body)
            return res.status(200).json({success:true,msg:'Record is modified'})
        } else {
            return res.status(401).json({success:false,msg:'User does not exist'})
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
    
}

const deleteProfileController = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user._id });
        if (user) {
            await Post.deleteMany({ ownerId: req.user._id });
            await Blog.deleteMany({ ownerId: req.user._id });
            await Comment.deleteMany({ ownerId: req.user._id });
            await UserModel.findOneAndDelete({ _id: user._id })
            return res.status(204).json({success:true,msg:'User is deleted.'})
        } else {
            return res.status(400).json({success:false, msg:'User does not exists'})
        }
    } catch (error) {
        return res.status(500).json({success:false, msg:error.message})
    }
}

module.exports = { registerController, loginController, logoutController, getProfileController, updateProfileController, deleteProfileController, getUserController }