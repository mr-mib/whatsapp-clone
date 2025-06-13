export function updateGroupHeader(group) {
  document.getElementById("chat-header").innerHTML = `
    <header class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <div class="flex items-center gap-2">
        <img src="${group.avatar}" class="w-10 h-10 rounded-full" />
        <span class="font-semibold">${group.name}</span>
      </div>
      <div class="flex items-center gap-4 text-gray-500">
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
        <button><i class="fa-solid fa-ellipsis-v"></i></button>
      </div>
    </header>
  `;
}
