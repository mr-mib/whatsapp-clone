import { state } from "../../state.js";
import { socket } from "../../socket.js";

export function renderChat() {
  setTimeout(setupFormHandler, 0);

  return `
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('./assets/bg-chat.png')] bg-cover"></div>
    <form id="chat-form" class="flex items-center px-4 py-2 border-t bg-white gap-2">
      <input type="file" id="file-input" class="hidden" />
      <button type="button" id="file-btn" class="text-gray-600">
        <i class="fa-solid fa-paperclip"></i>
      </button>
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

export function updateMessages(user) {
  fetch("http://localhost:3001/messages")
    .then((res) => res.json())
    .then((messages) => {
      const filtered = messages.filter(
        (msg) =>
          (msg.from === "me" && Number(msg.to) === Number(user.id)) ||
          (Number(msg.from) === Number(user.id) && msg.to === "me")
      );

      const html = filtered
        .map((msg) => {
          const isMe = msg.from === "me";
          const align = isMe ? "justify-end" : "justify-start";
          const bg = isMe ? "bg-green-200" : "bg-gray-200";
          const media = msg.media ? getMediaPreview(msg.media) : "";

          return `
          <div class="flex ${align}">
            <div class="max-w-xs px-4 py-2 rounded-lg ${bg} break-words">
              ${msg.text}
              ${media}
            </div>
          </div>
        `;
        })
        .join("");

      document.getElementById("chat-messages").innerHTML = html;
    });
}

function getMediaPreview(dataUrl) {
  if (dataUrl.startsWith("data:image")) {
    return `<img src="${dataUrl}" class="mt-2 rounded-md max-w-full" />`;
  }
  if (dataUrl.startsWith("data:audio")) {
    return `<audio controls class="mt-2 w-full"><source src="${dataUrl}"></audio>`;
  }
  return `<a href="${dataUrl}" download class="block mt-2 text-blue-600 underline">📎 Télécharger</a>`;
}

function setupFormHandler() {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");
  const fileInput = document.getElementById("file-input");
  const fileBtn = document.getElementById("file-btn");

  let selectedFile = null;

  fileBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!state.selectedUser) return;

    const text = input.value.trim();
    if (!text && !selectedFile) return;

    const sendMessage = (fileDataUrl = null) => {
      const newMessage = {
        from: "me",
        to: state.selectedUser.id,
        text: text || "",
        media: fileDataUrl,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
        .then((res) => res.json())
        .then(() => {
          input.value = "";
          fileInput.value = "";
          selectedFile = null;
          socket.emit("send_message", newMessage);
          updateMessages(state.selectedUser);
        })
        .catch((err) => {
          console.error("Erreur d'envoi du message :", err);
          alert("Échec d'envoi du message.");
        });
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => sendMessage(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      sendMessage();
    }
  });
}

// 🔁 Mise à jour en temps réel
socket.on("receive_message", (msg) => {
  if (!state.selectedUser) return;
  const isForCurrent =
    msg.from === state.selectedUser.id || msg.to === state.selectedUser.id;
  if (isForCurrent) {
    updateMessages(state.selectedUser);
  }
});
