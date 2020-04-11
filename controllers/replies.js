const thread = require('../models/thread');
const bcrypt = require('bcrypt');

exports.postReply = async (req,res) => {
  try {
    const text = req.body.text;
    const deletePassword = req.body.delete_password;
    const threadId = req.body.thread_id;
    //console.log(req.body);
    //Encrypt password
    const saltRounds = 6;
    const hash = await bcrypt.hash(deletePassword,saltRounds);

    //Add comment to thread
    const threadToReply = await thread.findById(threadId).exec();
    console.log(threadToReply)
    threadToReply.replies.push({
      text : text,
      password : hash 
    })
    await threadToReply.save();
    //Get id for reply and save document
    // const repliesLength = threadToReply.replies.length;
    // console.log(repliesLength);
    // const replyId = threadToReply.replies[repliesLength-1]._id;
    // console.log(replyId);
    
    
    //TODO: Redirect to board page
    //res.json(threadToReply);
    res.redirect('/');
  }
  catch(err) {
    res.send("An error has occurred.")
  }
}



exports.getReplies = async (req,res) => {
 try {
   const threadId = req.query.thread_id;
   const threadDoc = await thread.findById(threadId).exec();

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
    console.log(req.body)
    const threadDoc = await thread.findById(threadId).exec();
    const reply = await threadDoc.replies.id(replyId);
    const passwordCorrect = await bcrypt.compare(deletePassword,reply.password);
    console.log(passwordCorrect)
    if(!passwordCorrect) {
      console.log('Incorrect password')
      res.send("incorrect password");
    }
    else {
      reply.text = "[deleted]";
      await threadDoc.save();
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

    const threadDoc = await thread.findById(threadId).exec();
    const reply = await threadDoc.replies.id(replyId);
    reply.reported = true;
    threadDoc.save();
    res.send('success');
  }
  catch(err) {
    res.send('An error has occurred.');
  }
}

