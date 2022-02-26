const mongoose = require('mongoose');
let school = new mongoose.Schema({
    name:{
      type: String,
    },
    adminName:{
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
    }
})
module.exports = mongoose.model('school',school)