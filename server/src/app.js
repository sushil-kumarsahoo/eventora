const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth.routes')

const app = express()
app.use(express.json())
app.use(cors());

app.use('/api/auth', authRouter)

module.exports = app