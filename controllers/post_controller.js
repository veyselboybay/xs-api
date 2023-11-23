
const Post = require('../models/post')
const Comment = require('../models/comment')
const User = require('../models/user')

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort('-created_at').exec();
        return res.status(200).json({success:true,msg:'success',posts:posts})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ownerId:req.user._id}).sort('-created_at').exec();
        return res.status(200).json({success:true,msg:'success',posts:posts})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const createPost = async (req, res) => {
    try {
        const newPost = await Post.create({ ...req.body, ownerId: req.user._id })
        return res.status(201).json({success:true,msg:'new post created', post:newPost})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const likePost = async (req, res) => {
    // we will use req.user._id while pointing id
    const postId = req.params.postId;
    try {
        const post = await Post.findById({ _id: postId });
        if (!post) {
            return res.status(400).json({ success: false, msg: 'No Post Found!' });
        }
        await post.likes.push(req.user._id);
        await post.save()
        const updatedPost = await Post.findById({ _id: postId })
        return res.status(200).json({success:true,msg:'success'})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const unlikePost = async (req, res) => {
    const postId = req.params.postId;
    // we will use req.user._id while pointing id
    // Post.updateOne({_id:postId},
    //{
    //  $pull: {likes:{$in:req.user._id}}
    //},{new:true})
    try {
        const post = await Post.findById({ _id: postId });
        if (!post) {
            return res.status(400).json({ success: false, msg: 'No Post Found!' });
        }
        if (post.likes.includes(req.user._id)) {
            await Post.updateOne({ _id: postId }, {
                $pull: { likes: { $in: [req.user._id] } }
            }, { new: true });
            post.save()
            return res.status(200).json({success:true,msg:'success'})
        } else {
            return res.status(400).json({ success: false, msg: 'Something went wrong' });
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}
const getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const relatedPost = await Post.findById({ _id: postId })
        if (relatedPost.comments.length > 0) {
            const allComments = []
            for (let i = 0; i < relatedPost.comments.length; i++){
                const relatedComment = await Comment.findById({ _id: relatedPost.comments[i] })
                if (!relatedComment) {
                    await Post.updateOne({ _id: postId }, {
                            $pull: { comments: { $in: [relatedPost.comments[i]] } }
                    }, { new: true });
                    continue;
                }
                const relatedUser = await User.findById({ _id: relatedComment.ownerId }).select('-password')
                await allComments.push({ comment: relatedComment, username: relatedUser.username })
                if (Object.keys(allComments).length === relatedPost.comments.length) {
                    return res.status(200).json({success:true,msg:'all comments',comments:allComments})
                }
            }            
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}
const getComment = async (req, res) => {
    
}
const commentPost = async (req, res) => {
    // create a new comment and add its id in the post object
    const postId = req.params.postId;
    try {
        const relatedPost = await Post.findById({ _id: postId });
        if (!relatedPost) {
            return res.status(500).json({success:false,msg:"Post not found!"})
        }
        const newComment = await Comment.create({ ...req.body, ownerId: req.user._id, postId: postId })
        await relatedPost.comments.push(newComment._id)
        relatedPost.save()
        return res.status(201).json({success:true,msg:'new post created', comment: newComment})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const deleteComment = async (req, res) => {
    // we need to delete the comment by finding the comment by its id first and delete action
    // then we need to remove the comment id from post object by following codes
    // Post.updateOne({_id:postId},
    //{
    //  $pull: {comments:{$in:[commentId]}}
    //},{new:true})
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        const post = await Post.findById({ _id: postId });
        const comment = await Comment.findById({ _id: commentId });
        if (!post) {
            return res.status(400).json({ success: false, msg: 'No Post Found!' });
        }
        if (!comment) {
            return res.status(400).json({ success: false, msg: 'No comment Found!' });
        }
        if (post.comments.includes(comment._id)) {
            await Post.updateOne({ _id: postId }, {
                $pull: { comments: { $in: [comment._id] } }
            }, { new: true });
            post.save()
            await Comment.findOneAndDelete({_id:commentId})
            return res.status(200).json({success:true,msg:'success'})
        } else {
            return res.status(400).json({ success: false, msg: 'Something went wrong' });
        }
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(400).json({success:false,msg:'Post Not Exist!'})
        }
        if (!post.ownerId.equals(req.user._id)) {
            return res.status(401).json({success:false,msg:'Not Authorized!'})
        }
        await Post.findOneAndDelete({_id:post._id})
        return res.status(204).json({success:true,msg:'post deleted'})
    } catch (error) {
        return res.status(500).json({success:false,msg:error.message})
    }
}


module.exports = {getAllPosts,createPost,deletePost,likePost,commentPost,deleteComment, getComment, unlikePost,getComments,getMyPosts}