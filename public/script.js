
const socket = io();

const room = localStorage.getItem("room");
let name = localStorage.getItem("name");

if (!name) {
  name = prompt("Enter your name");
  localStorage.setItem("name", name);
}

socket.emit("joinRoom", { room });

socket.on("previousMessages", (messages) => {
  messages.forEach(msg => {
    displayMessage(msg);
  });
});

socket.on("message", (data) => {
  displayMessage(data);
});

function sendMessage() {
  const msg = document.getElementById("msg").value;

  const data = {
    room: room,
    name: name,
    message: msg
  };

  socket.emit("chatMessage", data);
  document.getElementById("msg").value = "";
}

function displayMessage(data) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${data.name}:</b> ${data.message}`;
  document.getElementById("chatBox").appendChild(div);
}
