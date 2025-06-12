import { updateHeader } from "../header/header.js";
import { updateMessages } from "../chat/chat.js";
import { state } from "../../state.js";
import { renderStatuses } from "./status.js";
import { showStatusModal } from "../modal.js";

export function renderSidebar() {
  setTimeout(fetchContacts, 0);

  return `
    <div class="flex flex-col h-full">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Utilisateurs</h2>
      </div>
      <div class="overflow-y-auto flex-1">
        <ul id="contact-list" class="divide-y divide-gray-200">
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
        <li data-user='${JSON.stringify(user)}'
            class="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer">
          <img src="${user.avatar}" alt="${
            user.name
          }" class="w-10 h-10 rounded-full" />
          <span class="font-medium">${user.name}</span>
        </li>
      `
        )
        .join("");

      renderStatuses(users).then((statusHtml) => {
        const container = document.createElement("div");
        container.className = "border-t mt-4";
        container.innerHTML = `
    <div class="p-4 font-semibold text-gray-600">Statuts</div>
    ${statusHtml}
  `;
        list.parentElement.appendChild(container);

        // Gestion du clic sur statut
        container.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", () => {
            const user = JSON.parse(li.dataset.user);
            const status = JSON.parse(li.dataset.status);
            showStatusModal(user, status);
          });
        });
      });

      list.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
          const user = JSON.parse(li.dataset.user);
          state.selectedUser = user;
          updateHeader(user);
          updateMessages(user);
        });
      });
    });
}
