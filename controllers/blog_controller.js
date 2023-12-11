const router = require('express').Router()
const Blog = require('../models/blog')


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort('-created_at').exec();
        return res.status(200).json({success:true,msg:'all the blogs',blogs:blogs})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ownerId:req.user._id}).sort('-created_at').exec();
        return res.status(200).json({success:true,msg:'success',blogs:blogs})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const getOneBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const relatedBlog = await Blog.findOne({ _id: blogId });
        if (!relatedBlog) {
            return res.status(404).json({success:false,msg:'Blog not found'}) 
        }
        return res.status(200).json({success:true,msg:'related blog',blog:relatedBlog})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const createBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create({ ...req.body, ownerId: req.user._id });
        return res.status(200).json({success:true,msg:'created new blog',blog:newBlog})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const likeBlog = async (req, res) => {
    const blogId = req.params.blogId;
    try {
        const relatedBlog = await Blog.findById({ _id: blogId });
        if (!relatedBlog) {
            return res.status(400).json({ success: false, msg: 'No Blog Found!' });
        }
        if (relatedBlog.likes.includes(req.user._id)) {
            return res.status(400).json({ success: false, msg: 'Already liked!' });
        }
        await relatedBlog.likes.push(req.user._id);
        await relatedBlog.save();
        return res.status(200).json({ success: true, msg: 'success' });
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const unlikeBlog = async (req, res) => {
    const blogId = req.params.blogId;
    try {
        const relatedBlog = await Blog.findById({ _id: blogId });
        if (!relatedBlog) {
            return res.status(400).json({ success: false, msg: 'No Blog Found!' });
        }
        if (relatedBlog.likes.includes(req.user._id)) {
            await Blog.updateOne({ _id: blogId }, {
                $pull: { likes: { $in: [req.user._id] } }
            }, { new: true });
            relatedBlog.save();
            return res.status(200).json({success:true,msg:'success unliked'})
        } else {
            return res.status(400).json({ success: false, msg: 'Something went wrong' });
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const relatedBlog = await Blog.findOne({ _id: blogId });
        if (!relatedBlog) {
            return res.status(400).json({success:false,msg:'Blog not found'}) 
        }
        if (!relatedBlog.ownerId.equals(req.user._id)) {
            return res.status(401).json({success:false,msg:'Not Authorized'}) 
        }
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: blogId }, req.body);
        return res.status(200).json({success:true,msg:'Blog is updated!'})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}


const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const relatedBlog = await Blog.findOne({ _id: blogId });
        if (!relatedBlog) {
            return res.status(400).json({success:false,msg:'Blog not found'}) 
        }
        if (!relatedBlog.ownerId.equals(req.user._id)) {
            return res.status(401).json({success:false,msg:'Not Authorized'}) 
        }
        const deletedBlog = await Blog.findOneAndDelete({ _id: blogId });
        return res.status(204).json({success:true,msg:'Blog is Deleted!'})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}



module.exports = {getAllBlogs, createBlog, updateBlog, deleteBlog,getOneBlog,getMyBlogs, likeBlog, unlikeBlog}