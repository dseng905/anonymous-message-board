import React , {useState} from'react'

const Reply = (props) => {
  const [deletePassword, setDeletePassword] = useState("");
  const [isReported, setReported] = useState(false);

  async function deleteReply(e) {
    e.preventDefault(); //Prevent redirect
    e.target.reset(); //Reset form

    const request = "/api/replies/" + props.board + "?_method=DELETE";
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

    //If successful, decrement reply count in the parent thread component
    if(status === 'success') {
      props.replyCountAdjust('DELETE')
    }

  }

  async function reportReply(e) {
    const request = "/api/replies/" + props.board + "?_method=PUT";
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

  // Input handler functions
  function handleDeletePassword(e) {
    setDeletePassword(e.target.value);
  }

  return (
    <div className="reply-container">
      {/* Reply Info*/}
      <p className="reply-created-on">
        {(new Date(props.createdOn)).toUTCString()}
      </p>
      <p>{props.text}</p>

      {/* Form to delete reply */}
      <form className="reply-delete-form" onSubmit={deleteReply}>
        <input 
          onChange={handleDeletePassword} 
          placeholder="Enter password to delete..." 
          type="password" 
        />
        <button 
          type="submit"
        >Delete</button>
      </form>

      {/* Button to report reply */}
      <button onClick={reportReply}>Report</button>

      {/* Display status if reply has been reported */}
      {isReported ? (<p>Reply has been reported!</p>) : (<div></div>)}
    </div>
  )
}

export default Reply
