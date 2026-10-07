const Router = require('express')
const authRouter = Router()
const {registerUser, loginUser,verifyOtp} = require('../controllers/auth.controller')

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/verify-otp', verifyOtp)

module.exports = authRouter