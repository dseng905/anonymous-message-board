import React, {useState, useEffect } from 'react'
import Thread from './Thread';
import {useParams} from 'react-router-dom';

const Board = () => {
  const [threadList, setThreadList] = useState([]);
  const [threadCount, setThreadCount] = useState(0);

  //States to indicate if any thread has been created or deleted
  const [isDeleted, setifThreadDeleted] = useState(false);
  const [threadCreated, setifThreadCreated] = useState(false);

  //State variables to handle input text
  const [newThreadText, setNewThreadText] = useState("");
  const [newThreadPassword, setNewThreadPassword] = useState("");

  //Set board name sent by React Router
  const {board} = useParams();

  useEffect(() => {
    async function fetchThreads() {
      const boardURL = '/api/threads/' + board;
      const res = await fetch(boardURL)
      const data = await res.json()
      
      //Parse JSON response into array
      const threads = [];
      data.forEach(obj => threads.push(obj));

      setThreadList(threads);
      setThreadCount(threads.length);
    }

    fetchThreads(); 
  }, [threadCount, board]); //Rerender if these state variables change
  

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
    e.preventDefault(); //Prevent redirect
    e.target.reset(); //clear form upon submit

    //Make server request to create thread in the board
    const request = "/api/threads/" + board;
    const res = await fetch(request, {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        text : newThreadText,
        delete_password : newThreadPassword,
      })
    })

    //If successfully created, update thread count
    const status = await res.text();
    if(status === 'success') {
      adjustThreadCount("CREATE");
      setifThreadCreated(true);
    }

  }

  //Functions to handle input data from forms
  function handleNewThreadText(e) {
    setNewThreadText(e.target.value);
  }

  function handleNewThreadPassword(e) {
    setNewThreadPassword(e.target.value);
  }


  return (
    <div className="board"> 
      {/* Title */}
      <h1>{"/" + board}</h1>

      {/* Display status updates on the top if a thread is deleted or created */}
      {isDeleted ? (<p>Thread has been deleted.</p>) : (<div></div>)}
      {threadCreated ? (<p>Thread has been created.</p>) : (<div></div>)}

      {/* Form to create a new thread */}
      <form onSubmit={createThread}>
        <textarea 
          onChange={handleNewThreadText} 
          className="board-textarea" 
          placeholder="Create a thread...">
        </textarea><br/>
        <input 
          onChange={handleNewThreadPassword} 
          type="password" 
          placeholder="Enter a password...">
        </input>
        <button 
          type="submit"
        >Submit</button>
      </form>

      {/* Render list of threads */}
      { 
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
