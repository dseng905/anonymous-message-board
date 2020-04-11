const mongoose = require('mongoose');

const thread = new mongoose.Schema({
  //this id refers to the id stored in board document, 
  //NOT the id of thread document itself (thread._id)
  //threadID : String, //board.threads.id(id)._id == thread.thread_id
  text: String,
  board : String, //the board the thread belongs to
  created_on : {type : Date, default: Date.now()},
  bumped_on : {type: Date, default: Date.now()},
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