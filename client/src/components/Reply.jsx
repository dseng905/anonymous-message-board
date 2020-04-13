import React , {useState} from'react'

const Reply = (props) => {
  const [deletePassword, setDeletePassword] = useState("");
  const [isReported, setReported] = useState(false);

  async function deleteReply(e) {
    e.preventDefault();
    e.target.reset();
    const serverURL = "";
    const request = serverURL + "/api/replies/" + props.board + "?_method=DELETE";
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        thread_id : props.thread_id,
        reply_id : props.reply_id,
        delete_password : deletePassword,
      })
    })
    const status = await res.text();

    if(status === 'success') {
      props.replyCountAdjust('DELETE')
    }

  }

  async function reportReply(e) {
    const serverURL = "";
    const request = serverURL + "/api/replies/" + props.board + "?_method=PUT";
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        thread_id : props.thread_id,
        reply_id : props.reply_id,
      })
    })

    setReported(true);
  }

  function handleDeletePassword(e) {
    setDeletePassword(e.target.value);
  }

  return (
    <div className="reply-container">
      <p className="reply-created-on">{(new Date(props.createdOn)).toUTCString()}</p>
      <p>{props.text}</p>
      <form className="reply-delete-form" onSubmit={deleteReply}>
        <input onChange={handleDeletePassword} placeholder="Enter password to delete..." type="password" />
        <button type="submit">Delete</button>
      </form>
      <button onClick={reportReply}>Report</button>
      {isReported ? (<p>Reply has been reported!</p>) : (<div></div>)}
    </div>
  )
}

export default Reply
