import { renderSidebar } from "../components/sidebar/sidebar.js";
import { renderChat } from "../components/chat/chat.js";
import { renderHeader } from "../components/header/header.js";

export function renderApp() {
  document.querySelector("#app").innerHTML = `
    <div class="flex h-screen w-full bg-gray-100">
      <!-- Sidebar -->
      <aside id="sidebar" class="w-[30%] min-w-[300px] max-w-[400px] border-r border-gray-300 bg-white">
        ${renderSidebar()}
      </aside>

      <!-- Chat -->
      <main class="flex-1 flex flex-col">
        ${renderHeader()}
        ${renderChat()}
      </main>
    </div>
  `;
}
