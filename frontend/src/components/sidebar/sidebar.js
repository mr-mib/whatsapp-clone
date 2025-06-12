export function renderSidebar() {
  setTimeout(fetchContacts, 0);

  return `
    <div class="flex flex-col h-full">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Utilisateurs</h2>
      </div>
      <div class="overflow-y-auto flex-1">
        <ul id="contact-list" class="divide-y divide-gray-200">
          <!-- contacts dynamiques ici -->
        </ul>
      </div>
    </div>
  `;
}

function fetchContacts() {
  fetch("http://localhost:3001/users")
    .then((res) => res.json())
    .then((users) => {
      const list = document.getElementById("contact-list");
      list.innerHTML = users
        .map(
          (user) => `
        <li class="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
          <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full" />
          <span class="font-medium">${user.name}</span>
        </li>
      `
        )
        .join("");
    })
    .catch((err) => {
      console.error("Erreur de chargement des utilisateurs :", err);
      document.getElementById("contact-list").innerHTML = `
        <li class="p-4 text-red-500">Impossible de charger les contacts.</li>
      `;
    });
}
