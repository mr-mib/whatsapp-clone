export function renderChat() {
  return `
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('./assets/bg-chat.png')] bg-cover">
      <!-- Messages à afficher ici -->
    </div>
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
