const thread = require('../models/thread');
const bcrypt = require('bcrypt');

exports.postReply = async (req,res) => {
  try {
    const text = req.body.text;
    const deletePassword = req.body.delete_password;
    const threadId = req.body.thread_id;

    //Encrypt password by hashing it with salt
    const saltRounds = 6;
    const hash = await bcrypt.hash(deletePassword,saltRounds);

    //Add comment to thread
    const threadToReply = await thread.findById(threadId).exec();
    //Update bumped on, the date of the last reply created
    threadToReply.bumped_on = new Date();
    threadToReply.replies.push({
      text : text,
      password : hash 
    })
    await threadToReply.save();
    
    res.send('success')
  }
  catch(err) {
    res.send("An error has occurred.")
  }
}



exports.getReplies = async (req,res) => {
 try {
   const threadId = req.query.thread_id;
   const threadDoc = await thread.findById(threadId).exec();
  
    //Send a json object without the password and reported properties
   res.json({
     _id : threadDoc._id,
     text : threadDoc.text,
     created_on : threadDoc.created_on,
     bumped_on : threadDoc.bumped_on,
     replies : threadDoc.replies.map(reply => ({
        _id : reply._id,
        text: reply.text,
        created_on : reply.created_on,
     }))
   })
 } 
 catch (err) {
   res.send('An error has occurred.')
 }
}


exports.deleteReply = async (req,res) => {
  try {
    const threadId = req.body.thread_id;
    const replyId = req.body.reply_id;
    const deletePassword = req.body.delete_password;
    
    //Obtain the thread and find reply in the replies property
    const threadDoc = await thread.findById(threadId).exec();
    const reply = await threadDoc.replies.id(replyId);

    //Compute the password stored with the input
    const passwordCorrect = await bcrypt.compare(deletePassword,reply.password);

    //If password is incorrect send an error message
    if(!passwordCorrect) {
      console.log('Incorrect password')
      res.send("incorrect password");
    }
    //Otherwise, replace the reply text with a deleted message
    else {
      reply.text = "[deleted]";
      await threadDoc.save();
      //This message is sent to the client
      res.send("success");
    }
  }
  catch (err) {
    console.log('Error')
    res.send("An error has occurred.")
  }
}


exports.reportReply = async (req,res) => {
  try {
    const threadId = req.body.thread_id;
    const replyId = req.body.reply_id;
    
    //Find the reply by find its thread with thread id and reply id given
    const threadDoc = await thread.findById(threadId).exec();
    const reply = await threadDoc.replies.id(replyId);
    reply.reported = true;
    threadDoc.save();

    //Send 'success message to the client if reported property has been changed
    res.send('success');
  }
  catch(err) {
    res.send('An error has occurred.');
  }
}

