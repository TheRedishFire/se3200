const API = "/messages";

const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const list = document.getElementById("list");

// GET /messages  →  returns ["hi", "hello"]
async function loadMessages() {
  const response = await fetch(API);          // HTTP GET
  const messages = await response.json();     // parse body text → JS array

  list.innerHTML = "";                        // clear the list
  for (const msg of messages) {
    const li = document.createElement("li");
    li.textContent = msg;
    list.appendChild(li);
  }
}

// POST /messages  →  creates a new message
async function sendMessage() {
  const text = input.value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })    // JS object → JSON text
  });

  input.value = "";                           // clear the textarea
  await loadMessages();                       // refresh the list
}

sendBtn.addEventListener("click", sendMessage);
loadMessages();                               // initial load