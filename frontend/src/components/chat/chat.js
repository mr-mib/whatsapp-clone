import { state } from "../../state.js";
import { socket } from "../../socket.js";

export function renderChat() {
  setTimeout(setupFormHandler, 0);

  return `
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('./assets/bg-chat.png')] bg-cover"></div>
    <form id="chat-form" class="flex items-center px-4 py-2 border-t bg-white gap-2 relative">
      <div class="relative">
        <button type="button" id="emoji-btn" class="text-gray-600">
          <i class="fa-regular fa-face-smile"></i>
        </button>
        <div id="emoji-popup" class="absolute bottom-10 left-0 p-2 bg-white border rounded shadow-md grid grid-cols-6 gap-2 text-xl hidden z-50 w-52 max-h-48 overflow-y-auto">
          <span>😀</span><span>😃</span><span>😄</span><span>😁</span><span>😆</span><span>😅</span>
          <span>😂</span><span>🤣</span><span>😊</span><span>😇</span><span>🙂</span><span>🙃</span>
          <span>😉</span><span>😌</span><span>😍</span><span>🥰</span><span>😘</span><span>😗</span>
          <span>😙</span><span>😚</span><span>😋</span><span>😛</span><span>😝</span><span>😜</span>
          <span>🤪</span><span>🤨</span><span>🧐</span><span>🤓</span><span>😎</span><span>🤩</span>
          <span>🥳</span><span>😏</span><span>😒</span><span>😞</span><span>😔</span><span>😟</span>
          <span>😕</span><span>🙁</span><span>☹️</span>
        </div>
      </div>
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
  fetch(`${state.backendUrl}/messages`)  // ${state.backendUrl}/messages  === http://localhost:3001/messages
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

export function updateGroupMessages(group) {
  fetch(`${state.backendUrl}/messages`)   // `${state.backendUrl}/messages` === "http://localhost:3001/messages"
    .then((res) => res.json())
    .then((messages) => {
      const filtered = messages.filter((msg) => msg.to === `group-${group.id}`);

      const html = filtered
        .map((msg) => {
          const isMe = msg.from === "me";
          const align = isMe ? "justify-end" : "justify-start";
          const bg = isMe ? "bg-green-200" : "bg-gray-200";
          const label = isMe ? "Moi" : `👤 ${msg.from}`;
          const media = msg.media ? getMediaPreview(msg.media) : "";

          return `
          <div class="flex ${align}">
            <div class="max-w-xs px-4 py-2 rounded-lg ${bg} break-words">
              <div class="text-xs text-gray-500 mb-1">${label}</div>
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
  // 🔒 Empêche la double initialisation
  if (window.__formHandlerSetup) return;
  window.__formHandlerSetup = true;
  console.log("✅ Handler attaché une seule fois");

  const form = document.getElementById("chat-form");
  const input = document.getElementById("message-input");
  const fileInput = document.getElementById("file-input");
  const fileBtn = document.getElementById("file-btn");
  const emojiBtn = document.getElementById("emoji-btn");
  const emojiPopup = document.getElementById("emoji-popup");

  let selectedFile = null;

  fileBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
  });

  emojiBtn.addEventListener("click", () => {
    emojiPopup.classList.toggle("hidden");
  });

  emojiPopup.querySelectorAll("span").forEach((e) => {
    e.addEventListener("click", () => {
      input.value += e.textContent;
      emojiPopup.classList.add("hidden");
      input.focus();
    });
  });

  document.addEventListener("click", (e) => {
    const isEmoji =
      emojiBtn.contains(e.target) || emojiPopup.contains(e.target);
    if (!isEmoji) {
      emojiPopup.classList.add("hidden");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const to = state.selectedUser
      ? state.selectedUser.id
      : state.selectedGroup
      ? `group-${state.selectedGroup.id}`
      : null;

    if (!to) return;

    const text = input.value.trim();
    if (!text && !selectedFile) return;

    const sendMessage = (fileDataUrl = null) => {
      const newMessage = {
        from: "me",
        to,
        text: text || "",
        media: fileDataUrl,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      console.log("📤 Envoi du message :", newMessage);

      // `${state.backendUrl}/messages` === "http://localhost:3001/messages"
      fetch(`${state.backendUrl}/messages`, {
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

// 🔁 Écoute Socket.IO : actualisation live
socket.on("receive_message", (msg) => {
  console.log("📥 Message reçu via socket :", msg);

  const currentGroupId = state.selectedGroup?.id;
  const currentUserId = state.selectedUser?.id;

  if (msg.to === `group-${currentGroupId}`) {
    updateGroupMessages(state.selectedGroup);
  } else if (
    (msg.from === currentUserId && msg.to === "me") ||
    (msg.to === currentUserId && msg.from === "me")
  ) {
    updateMessages(state.selectedUser);
  }
});
