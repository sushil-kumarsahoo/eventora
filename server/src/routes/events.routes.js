const express = require("express");
const Eventrouter = express.Router();
const { authUser, authAdmin } = require('../middlewares/auth.middleware')
const {getAllEvents, getEventById, createEvent, updateEvent, deleteEvent} = require('../controllers/event.controller')

Eventrouter.get('/', getAllEvents);
Eventrouter.get('/:id', getEventById);
Eventrouter.post('/', authUser, authAdmin, createEvent);
Eventrouter.put('/:id', authUser, authAdmin, updateEvent);
Eventrouter.put('/:id', authUser, authAdmin, deleteEvent);


module.exports = Eventrouter;