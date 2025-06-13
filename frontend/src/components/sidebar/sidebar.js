import { updateHeader } from "../header/header.js";
import { updateMessages } from "../chat/chat.js";
import { state } from "../../state.js";
import { renderStatuses } from "./status.js";
import { showStatusModal } from "../modal.js";
import { updateGroupHeader } from "../header/group_header.js";
import { updateGroupMessages } from "../chat/chat.js";
import { renderChat } from "../chat/chat.js";

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
  fetch("https://render-json-server-oz0p.onrender.com/users") // `${state.backendUrl}/users` === "http://localhost:3001/users"
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

  fetchGroups();
}

function fetchGroups() {
  
  // "http://localhost:3001/groups" === `${state.backendUrl}/groups`
  fetch(`${state.backendUrl}/groups`) 
    .then((res) => res.json())
    .then((groups) => {
      const container = document.createElement("div");
      container.className = "border-t mt-4";
      container.innerHTML = `
        <div class="p-4 font-semibold text-gray-600">Groupes</div>
        <ul id="group-list" class="divide-y divide-gray-200">
          ${groups
            .map(
              (g) => `
            <li class="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
                data-group='${JSON.stringify(g)}'>
              <img src="${g.avatar}" alt="${
                g.name
              }" class="w-10 h-10 rounded-full" />
              <div>
                <div class="font-medium">${g.name}</div>
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
      document
        .getElementById("contact-list")
        .parentElement.appendChild(container);

      // Gestion du clic
      container.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
          const group = JSON.parse(li.dataset.group);
          state.selectedGroup = group;
          state.selectedUser = null;
          updateGroupHeader(group);
          renderChat(); // ← ← ← important
          updateGroupMessages(group);
        });
      });
    });
}
