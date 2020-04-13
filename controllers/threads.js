const mongoose = require('mongoose');
const thread = require('../models/thread');
const bcrypt = require('bcrypt');


exports.postThread = async (req,res) => {
  try {
    //console.log(req.body);
    const text = req.body.text;
    const deletePassword = req.body.delete_password;
    //If any queries are invalid
    if(!text || !deletePassword) {
      return res.send("Thread could not be submitted.");
    }

    //Encrypt password by hashing it
    const saltRounds = 6;
    const hash = await bcrypt.hash(deletePassword,saltRounds);

    const newThread = new thread({
      text : text,
      board: req.params.board,
      password: hash,
    });

    await newThread.save();

    //TODO: Redirect to /b/{board}
    // res.json({
    //   text : text,
    //   password: hash,
    // })
    //res.redirect('/');
    res.send("success");
  }
  catch(err) {
    return res.send("Thread could not submitted.");
  }
}



exports.getThreads = async (req,res) => {
  try {
    const boardThreads = await thread.find({board: req.params.board});

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
    const threadToDelete = await thread.findById(thread_id).exec();
    const passwordCorrect = await bcrypt.compare(delete_password, threadToDelete.password);

    if(!passwordCorrect) {
      res.send("Incorrect password");
    }
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
    const threadToReport = await thread.findByIdAndUpdate(req.body.thread_id, {reported: true}).exec();
    res.send("success");
  }
  catch(err) {
    res.send("Thread does not exist.")
  }
}
