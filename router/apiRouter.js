const express = require('express');
const router = express.Router();
const replies = require('../controllers/replies');
const threads = require('../controllers/threads');
const boards = require('../controllers/boards');

router.route('/boards')
  .get(boards.getBoardLists); //Get a list of active boards

router.route('/threads/:board')
  .post(threads.postThread) //post a thread
  .get(threads.getThreads) //get recent threads
  .delete(threads.deleteThread) //delete thread
  .put(threads.reportThread); //report thread

router.route('/replies/:board')
  .post(replies.postReply) //post a comment
  .get(replies.getReplies) //get all replies of a thread
  .delete(replies.deleteReply) //delete a comment
  .put(replies.reportReply); //report a comment

module.exports = router;