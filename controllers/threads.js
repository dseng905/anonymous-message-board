const thread = require('../models/thread');
const bcrypt = require('bcrypt');


exports.postThread = async (req,res) => {
  try {
    const text = req.body.text;
    const deletePassword = req.body.delete_password;

    //If any queries are invalid
    if(!text || !deletePassword) {
      return res.send("Thread could not be submitted.");
    }

    //Encrypt password by hashing it
    const saltRounds = 6;
    const hash = await bcrypt.hash(deletePassword,saltRounds);

    //Added the new thread to the database
    const newThread = new thread({
      text : text,
      board: req.params.board,
      password: hash,
    });
    await newThread.save();

    res.send("success");
  }
  catch(err) {
    return res.send("Thread could not submitted.");
  }
}



exports.getThreads = async (req,res) => {
  try {
    //Find the board the thread is in
    const boardThreads = await thread.find({board: req.params.board});

    //Send an JSON object containing the then most recent thread
    const output = boardThreads.map(thr => ({
      _id : thr._id,
      text : thr.text,
      board: thr.board,
      created_on : thr.created_on,
      bumped_on : thr.bumped_on,
      replies: thr.replies.map(reply => ({
                  id: reply._id,  
                  text : reply.text,
                  created_on : reply.created_on,
                }))
                .sort((a,b) => b.created_on - a.created_on)
                .slice(0, thr.replies.length >= 3 ? 3 : thr.replies.length)
    }))
    .sort((a,b) => b.bumped_on - a.bumped_on)
    .slice(0, boardThreads.length >= 10 ? 10 : boardThreads.length);

    res.send(output);
  } 
  catch (err) {
    return res.send("Threads could not be retrieved from board " + req.params.board);
  }
}


exports.deleteThread = async (req,res) => {
  try {
    const thread_id = req.body.thread_id;
    const delete_password = req.body.delete_password;

    //Find the thread
    const threadToDelete = await thread.findById(thread_id).exec();

    //Check if the input is equal to the password stored
    const passwordCorrect = await bcrypt.compare(delete_password, threadToDelete.password);

    //If password is incorrect, send error message
    if(!passwordCorrect) {
      res.send("Incorrect password");
    }
    //Otherwise, delete thread from database and send success message to client
    else {
      await thread.deleteOne({_id : thread_id});
      res.send("success");
    }
  }
  catch (err) {
    res.send("Cannot delete thread.")
  }
}


exports.reportThread = async (req,res) => {
  try {
    //Find thread and update reported property to true
    await thread.findByIdAndUpdate(req.body.thread_id, {reported: true}).exec();
    res.send("success");
  }
  catch(err) {
    res.send("Thread does not exist.")
  }
}
