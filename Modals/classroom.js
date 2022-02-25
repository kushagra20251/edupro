const mongoose = require('mongoose');
let Classroom = new mongoose.Schema({
    name:{
      type: String,
    },
    subject:{
      type: String,
    },
    link:{
      type: String,
    },
    facultyId:{
      type: String,
    },
    numberOfStudents:{
      type: Number,
    },
    studentIds:{
      type: Array,
    }
})
module.exports = mongoose.model('Classroom',Classroom)