const mongoose = require('mongoose');
const thread = require('../models/thread');

exports.getBoardLists = async (req,res) => {
  try {
    const boardLists = await thread.distinct('board').exec();
    res.send(boardLists);
  }
  catch (err) {
    res.send("Error has occurred.")
  }
}