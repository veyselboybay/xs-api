const router = require('express').Router()
const { getAllPosts, createPost,deletePost,likePost,commentPost, deleteComment, getComment, unlikePost,getComments,getMyPosts } = require('../controllers/post_controller');

router.get('/', getAllPosts)
router.get('/mine', getMyPosts)
router.post('/', createPost)
router.get('/:postId/like',likePost)
router.get('/:postId/unlike',unlikePost)
router.post('/:postId/comment', commentPost)
router.get('/:postId/comments', getComments)
// router.get('/:postId/comment/:commentId', getComment)
router.delete('/:postId/comment/:commentId',deleteComment)
router.delete('/:id',deletePost)


module.exports = router;