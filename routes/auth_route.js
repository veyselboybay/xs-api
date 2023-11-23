const router = require('express').Router()
const { authMiddleware } = require('../middleware/authMiddleware')

const { registerController, loginController, logoutController, getProfileController, updateProfileController, deleteProfileController, getUserController } = require('../controllers/auth_controllers')

router.post("/register", registerController)

router.post("/login", loginController)

router.post("/logout", logoutController)

router.get('/user/:id',getUserController)

router.get("/profile", authMiddleware, getProfileController)

router.post("/profile/update", authMiddleware, updateProfileController)

router.delete("/profile/delete", authMiddleware, deleteProfileController)


module.exports = router