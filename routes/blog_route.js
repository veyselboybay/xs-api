const router = require('express').Router()
const { getAllBlogs,createBlog,updateBlog,deleteBlog,getOneBlog, getMyBlogs } = require('../controllers/blog_controller')



router.get('/', getAllBlogs);
router.get('/mine', getMyBlogs);
router.get('/:blogId', getOneBlog);
router.post('/', createBlog);
router.post('/:blogId', updateBlog)
router.delete('/:blogId',deleteBlog)



module.exports = router;