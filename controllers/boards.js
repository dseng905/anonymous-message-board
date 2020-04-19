const thread = require('../models/thread');

exports.getBoardLists = async (req,res) => {
  try {
    //Looking at the entry in the thread model, get a unique board list
    const boardLists = await thread.distinct('board').exec();
    res.send(boardLists);
  }
  catch (err) {
    res.send("Error has occurred.")
  }
}