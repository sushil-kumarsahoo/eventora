const Router = require('express')
const authRouter = Router()
const {registerUser} = require('../controllers/auth.controller')

authRouter.post('/register', registerUser)
// authRouter.post('/login', loginUser)
// authRouter.post('/verify-otp', verifyOtp)

module.exports = authRouter