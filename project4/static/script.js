// text area
const messageInput = document.getElementById('messageInput');

// listen for when the user hits "Send" / submits
const messageForm = document.getElementById('messageForm');

//  display/inject the messages onto the page already posted
const messageContainer = document.getElementById('messageContainer');

const sendBtn = document.getElementById('submitBtn')

API = "/api";

// load is the get function returns ["hi", "hello"]
// remember GET/POST is from browser side of things
async function loadMessages() {
  const response = await fetch(API);
  const messages = await response.json();
  messageContainer.innerHTML = ""
  for(const msg of messages){
    const li = document.createElement("li");
    li.textContent = msg;
    messageContainer.appendChild(li);
  }
}
async function postMessage(e) {
  e.preventDefault(); // prevents browser from reloading page
  const text = messageInput.value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //formatting for json
    //converting js object into JSON
    body: JSON.stringify({ message: text })
  });
  messageInput.value = ""
  await loadMessages();
}
loadMessages();
//sendBtn.addEventListener('click', postMessage);
messageForm.addEventListener('submit', postMessage); // if they press enter

/*
fetch(api routh)
.then
respose
.then
data
*/

