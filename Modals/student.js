const mongoose = require('mongoose');
let student = new mongoose.Schema({
    name:{
      type: String,
    },
    courseList:{
      type: Array,
    },
    schoolCode:{
      type:String
    },
    password:{
      type:String
    },
    email:{
      type:String
    }
})
module.exports = mongoose.model('student',student)