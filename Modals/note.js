const mongoose = require('mongoose');
let note = new mongoose.Schema({
    title:{
      type: String,
    },
    notes:{
      type: String,
    },
    notesBy:{
      type: String,
    },
})
module.exports = mongoose.model('note',note)