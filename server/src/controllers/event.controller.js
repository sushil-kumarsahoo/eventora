const eventModel = require("../models/event.model");

async function getAllEvent(req, res) {
  try {
    const filters = {}
    if(req.query.category){
        filters.category = req.query.category;
    }
    if(req.query.location){
        filters.location = req.query.location;
    }
    const events = await eventModel.find(filters).populate('createdBy', 'name email');
    res.json(events)
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message });
  }
};
