const mongoose = require('mongoose');
let school = new mongoose.Schema({
    name:{
      type: String,
    },
    schoolCode:{
      type: String,
    },
    facultiesId:{
      type: String,
    },
    studentIds:{
      type: Array,
    },
    courseIds:{
      type: Array
    },
    password:{
      type:String
    },
    email:{
      type:String
    }
})
module.exports = mongoose.model('school',school)