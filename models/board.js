const mongoose = require('mongoose');

const board = new mongoose.Schema({
  board : String,
  threads : [{password : String}]
  //Each thread subdocument has an _id to refers to a thread stored in
  //the thread document. (See thread model)
});

module.exports = mongoose.model('board', board);