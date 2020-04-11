//let threadHTML = "";
function deleteReply(threadId, replyId) {
  const form = document.getElementById(replyId + '-form');
  const password = form.value;
  console.log(password);
  fetch('/api/replies/test?_method=DELETE', {
        method : "post",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({
          thread_id : threadId,
          reply_id : replyId,
          delete_password : password
        })
  })
  .then(res => window.location.replace('/'))
}


function createThreadInput(board) {
  let threadHTML = "";
  threadHTML += '<h4>Post a Thread</h4>'
  threadHTML += '<form action="/api/threads/' + board + '" method="POST">'
  threadHTML += '<textarea name="text" row="50" col="500" placeholder="Type text here..." id="'+ board + '-create-thread"></textarea><br>';
  threadHTML += '<input name="delete_password" type="text" placeholder="Enter a password..." id="'+ board + '-create-thread-password"><br>';
  threadHTML += '<input type="submit">'
  threadHTML += '</form>'
  return threadHTML;

  
}

function showReply(reply,thread) {
  let threadHTML = "";
  //console.log(reply);
  //Display reply information
  threadHTML += '<div class="reply"><p><i>' + reply.created_on + '</i></p>';
  threadHTML += '<p>' + reply.text + '</p>'
  //threadHTML += '<form id="' + reply.id + '-form"' + '>';

  //Create delete button with password input
  threadHTML += '<input id="' + reply.id + '-form"' + 'type="text" name="delete_id" placeholder="Type password to delete...">';
  threadHTML += '<button onclick="deleteReply(\'' + thread._id + '\',\'' + reply.id + '\')">Delete</button>';
  threadHTML += '</div>';

  return threadHTML;
}

function showThread(thread) {
  let threadHTML = "";

  //Show thread information
  threadHTML += '<div class="thread">';
  threadHTML += '<p>' + thread.created_on + '</p>';
  threadHTML += '<p><strong>'+ thread.text + '</strong> id: '+ thread._id +'</p>';

  //Show comments from thread object
  thread.replies.forEach(reply => {
    threadHTML += showReply(reply,thread);
  })
  threadHTML += '</div>';
  return threadHTML;
}

fetch('/api/threads/test')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const board = "test";
    let threadHTML = "";
    threadHTML += createThreadInput(board);
    data.forEach(thread => {
      //console.log(thread);
      threadHTML += showThread(thread);
    })
    
    document.getElementById('threads-show').innerHTML = threadHTML;
  });

