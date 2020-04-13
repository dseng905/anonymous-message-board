import React, {useState, useEffect} from 'react';
import './App.css';
import Board from './components/Board';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";


function App() {
  const [boardQuery, setBoardQuery] = useState("");
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    async function fetchBoards() {
      const serverURL = "/api/boards";
      const res = await fetch(serverURL);
      const data = await res.json();
      const list = [];
      data.forEach(board => list.push(board));
      setBoardList(list);
    }

    fetchBoards();
  }, [])

  function handleBoardQuery(e) {
    setBoardQuery(e.target.value)
  }

  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/main" />
      </Route>
      <div class="App-container">
        <div className="board-list-container">
          <h1 className="title">Anonymous Message Board</h1>
          <h2 className="board-list-title">Boards</h2>
          <form className="board-query-form">
            <input type="text" placeholder="Type board name..." onChange={handleBoardQuery} />
            <Link to={"/" + boardQuery}><button type="submit">Go</button></Link>
          </form>
          <ul className="board-list">
            {
              boardList.map(board =>(
                <li key={board}>
                  <span><Link to={"/" + board}>{board}</Link></span>
                </li>)
              )
            }
          </ul>
          <div className="copyright">Copyright 2020 Sovanarung Seng. All Right Reserved.</div>
        </div>
        <Switch>
          <Route path="/:board" children={<Board />} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
