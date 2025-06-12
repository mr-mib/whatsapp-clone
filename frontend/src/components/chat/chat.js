import { state } from "../../state.js";

export function renderChat() {
  return `
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('./assets/bg-chat.png')] bg-cover"></div>
    <form id="chat-form" class="flex items-center px-4 py-2 border-t bg-white gap-2">
      <input
        type="text"
        id="message-input"
        placeholder="Tape un message"
        class="flex-1 p-2 rounded-full border bg-gray-100 focus:outline-none"
      />
      <button type="submit" class="text-green-600 font-bold">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  `;
}

export function updateMessages(user) {
  fetch("http://localhost:3001/messages")
    .then((res) => res.json())
    .then((messages) => {
      const filtered = messages.filter(
        (msg) =>
          (msg.from === "me" && msg.to === user.id) ||
          (msg.from === user.id && msg.to === "me")
      );

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
