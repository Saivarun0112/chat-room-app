const socket = io();

const room = localStorage.getItem("room");
let name = localStorage.getItem("name");

if (!name) {
  name = prompt("Enter your name");
  localStorage.setItem("name", name);
}

socket.emit("joinRoom", { room });

socket.on("previousMessages", (messages) => {
  document.getElementById("chatBox").innerHTML = "";

  messages.forEach(msg => {
    displayMessage(msg);
  });
});

socket.on("message", (data) => {
  displayMessage(data);
});

socket.on("chatDeleted", () => {
  document.getElementById("chatBox").innerHTML = "";
});

function sendMessage() {

  const msg = document.getElementById("msg").value;

  if(msg.trim() === "") return;

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

function deleteChat(){

  const confirmDelete = confirm("Delete all messages in this room?");

  if(confirmDelete){

    socket.emit("deleteChat", { room: room });

  }

}