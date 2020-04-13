import React, {useState, useEffect } from 'react'
import Thread from './Thread';
import {useParams} from 'react-router-dom';

const Board = () => {
  const [threadList, setThreadList] = useState([]);
  const [threadCount, setThreadCount] = useState(0);
  const [isDeleted, setifThreadDeleted] = useState(false);
  const [threadCreated, setifThreadCreated] = useState(false);
  const [newThreadText, setNewThreadText] = useState("");
  const [newThreadPassword, setNewThreadPassword] = useState("");
  const {board} = useParams();

  function adjustThreadCount(request) {
    if(request === "DELETE") {
      setThreadCount(threadCount-1);
      setifThreadDeleted(true);
    }
    if(request === "CREATE") {
      setThreadCount(threadCount+1);
    }
  }

  async function createThread(e) {
    e.preventDefault();
    e.target.reset();
    const serverURL = "";
    const request = serverURL + "/api/threads/" + board;
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        text : newThreadText,
        delete_password : newThreadPassword,
      })
    })
    const status = await res.text();
    
    if(status === 'success') {
      adjustThreadCount("CREATE");
      setifThreadCreated(true);
    }

  }

  function handleNewThreadText(e) {
    setNewThreadText(e.target.value);
  }

  function handleNewThreadPassword(e) {
    setNewThreadPassword(e.target.value);
  }

  useEffect(() => {
    async function fetchThreads() {
      const serverURL = "";
      const boardURL = serverURL + '/api/threads/' + board;
      const res = await fetch(boardURL)
      const data = await res.json()
  
      const threads = [];
      data.forEach(obj => threads.push(obj));
      setThreadList(threads);
      setThreadCount(threads.length);
    }

    fetchThreads(); 
  }, [threadCount, board]);

  return (
    <div className="board"> 
      <h1>{"/" + board}</h1>
      {isDeleted ? (<p>Thread has been deleted.</p>) : (<div></div>)}
      {threadCreated ? (<p>Thread has been created.</p>) : (<div></div>)}
      <form onSubmit={createThread}>
        <textarea onChange={handleNewThreadText} className="board-textarea" placeholder="Create a thread..."></textarea><br/>
        <input onChange={handleNewThreadPassword} type="password" placeholder="Enter a password..."></input>
        <button type="submit">Submit</button>
      </form>
      { //Render threads in the board
        threadList.map(thread => (
          <Thread
            board={board}
            text={thread.text}
            _id={thread._id}
            createdOn={thread.created_on}
            bumpedOn={thread.bumped_on}
            key={thread._id}
            threadCountAdjust={adjustThreadCount}
          />
        ))
      }
    </div>
  )
}

export default Board;
