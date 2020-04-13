import React, {useState, useEffect} from 'react';
import Reply from './Reply';

const Thread = (props) => {
  const [deletePassword, setDeletePassword] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyPassword, setReplyPassword] = useState("");
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [deleteCount, setDeleteReplyCount] = useState(0);
  const [isReported, setReported] = useState(false);

  useEffect(() => {
    async function fetchReplies() {
      const serverURL = "";
      const request = serverURL + "/api/replies/" + props.board + "?thread_id=" + props._id;
      const res = await fetch(request);
      const data = await res.json();
      console.log(data);
      setReplies(data.replies);
      setReplyCount(data.replies.length);
    }

    fetchReplies();
  }, [replyCount, deleteCount])

  async function createReply(e) {
    e.preventDefault();
    e.target.reset();
    const serverURL = "";
    const request = serverURL + "/api/replies/" + props.board;
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        text : replyText,
        delete_password : replyPassword,
        thread_id : props._id
      })
    })
    const status = await res.text();
    if(status === 'success') {
      setReplyCount(replyCount+1);
    }  
  }

  async function deleteThread(e) {
    e.preventDefault();
    e.target.reset();
    const serverURL = "";
    const request = serverURL + "/api/threads/" + props.board + "?_method=DELETE";
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        thread_id : props._id,
        delete_password : deletePassword,
      })
    })

    //Check status to see if we need to rerender
    const status = await res.text();
    if(status === "success") {
      props.threadCountAdjust("DELETE");
    }
  }

  async function reportThread() {
    const serverURL = "";
    const request = serverURL + "/api/threads/" + props.board + "?_method=PUT";
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        thread_id : props._id,
      })
    })
    setReported(true);
  }

  function handleDeleteCount(action) {
    if(action === 'DELETE') {
      setDeleteReplyCount(deleteCount + 1);
    }
  }

  function handlePassword(e) {
    setDeletePassword(e.target.value);
  }

  function handleReplyText(e) {
    setReplyText(e.target.value);
  }

  function handleReplyPassword(e) {
    setReplyPassword(e.target.value);
  }

  return (
    <div className='thread-container'>
      <p className="thread-created-on">{(new Date(props.createdOn)).toUTCString()}</p>
      <p className="thread-bumped-on">Last Reply: {(new Date(props.bumpedOn)).toUTCString()} </p>
      <p className="thread-text">{props.text}</p>

      <div className="thread-controls">
        <form className="thread-delete-form" onSubmit={deleteThread}>
          <input className="thread-delete-password" placeholder="Enter password to delete..." type="password" onChange={handlePassword} />
          <button className="thread-delete-button" type="submit">Delete</button>
        </form>
        <button onClick={reportThread} className="thread-report-button">Report</button><br/><br/>
      </div>
      {isReported ? (<p>Thread has been reported!</p>) : <div></div>}

      <form className="thread-create-reply-form" onSubmit={createReply}>
        <textarea  onChange={handleReplyText} className="thread-textarea" placeholder="Reply to thread..."></textarea><br/>
        <input className="thread-create-reply-password" type="password" placeholder="Enter a password..." onChange={handleReplyPassword}/>
        <button className="thread-create-reply-submit" type="submit">Submit</button>
      </form>

      <p>Replies ({replyCount})</p>
      {
        replies.map(reply => (
          <Reply 
            key={reply._id}
            text={reply.text}
            thread_id={props._id}
            reply_id={reply._id}
            createdOn={reply.created_on}
            replyCountAdjust={handleDeleteCount}
          />
        ))
      }
    </div>
  )
}

export default Thread;
