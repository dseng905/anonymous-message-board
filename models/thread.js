const mongoose = require('mongoose');

const thread = new mongoose.Schema({
  text: String,
  board : String, //the board the thread belongs to
  created_on : {type : Date, default: Date.now()},
  bumped_on : {type: Date, default: Date.now()}, //Date when last reply was added
  reported : {type : Boolean, default: false},
  password : {type : String, required: true},
  replies : [{
    //Each comment subdocument will have an _id
    text : String,
    password : {type : String, required: true},
    created_on : {type: Date, default: Date.now()},
    reported : {type: Boolean, default: false}
  }] 
});

module.exports = mongoose.model('thread', thread);