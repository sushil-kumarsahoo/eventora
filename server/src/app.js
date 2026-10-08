const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth.routes')
const Eventrouter = require('./routes/events.routes')
const bookingRouter = require('./routes/booking.routes')

const app = express()
app.use(express.json())
app.use(cors());

app.use('/api/auth', authRouter)
app.use('/api/events', Eventrouter)
app.use('/api/bookings', bookingRouter)

module.exports = app