import { state } from "../../state.js";
// import { socket } from "../socket.js";
import { socket } from "../../socket.js";

export function renderChat() {
  setTimeout(setupFormHandler, 0);

  return `
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('./assets/bg-chat.png')] bg-cover"></div>
    <form id="chat-form" class="flex items-center px-4 py-2 border-t bg-white gap-2">
      <input
        type="text"
        id="message-input"
        placeholder="Tape un message"
        class="flex-1 p-2 rounded-full border bg-gray-100 focus:outline-none"
        required
      />
      <button type="submit" class="text-green-600 font-bold">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  `;
}

function setupFormHandler() {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text || !state.selectedUser) return;

    const newMessage = {
      from: "me",
      to: state.selectedUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // POST vers JSON Server
    fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then(() => {
        input.value = "";
        socket.emit("send_message", newMessage); // 🔁 temps réel
        updateMessages(state.selectedUser);
      })
      .catch((err) => {
        console.error("Erreur d'envoi du message :", err);
        alert("Échec d'envoi du message.");
      });
  });
}

export function updateMessages(user) {
  fetch("http://localhost:3001/messages")
    .then((res) => res.json())
    .then((messages) => {
      console.log("Tous les messages récupérés :", messages);

      const filtered = messages.filter(
        (msg) =>
          (msg.from === "me" && Number(msg.to) === Number(user.id)) ||
          (Number(msg.from) === Number(user.id) && msg.to === "me")
      );

      console.log("Messages filtrés pour ce user :", filtered);

      const html = filtered
        .map(
          (msg) => `
        <div class="flex ${
          msg.from === "me" ? "justify-end" : "justify-start"
        }">
          <div class="max-w-xs px-4 py-2 rounded-lg ${
            msg.from === "me" ? "bg-green-200" : "bg-gray-200"
          }">
            ${msg.text}
          </div>
        </div>
      `
        )
        .join("");

      document.getElementById("chat-messages").innerHTML = html;
    });
}

socket.on("receive_message", (msg) => {
  if (!state.selectedUser) return;
  const isForCurrent =
    msg.from === state.selectedUser.id || msg.to === state.selectedUser.id;
  if (isForCurrent) {
    updateMessages(state.selectedUser);
  }
});
