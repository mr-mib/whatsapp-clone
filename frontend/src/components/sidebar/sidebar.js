export function renderSidebar() {
  fetch("http://localhost:3001/users")
    .then((res) => res.json())
    .then((users) => {
      const list = document.getElementById("contact-list");
      list.innerHTML = users
        .map(
          (user) => `
        <li class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full" />
          <span>${user.name}</span>
        </li>
      `
        )
        .join("");
    });

  return `
    <div class="flex flex-col h-full">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Utilisateurs</h2>
      </div>
      <div class="overflow-y-auto flex-1">
        <ul id="contact-list" class="space-y-1">
          <li class="text-center text-gray-400 italic py-3">Chargement...</li>
        </ul>
      </div>
    </div>
  `;
}
