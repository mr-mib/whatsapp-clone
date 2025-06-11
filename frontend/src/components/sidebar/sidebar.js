export function renderSidebar() {
  return `
    <div class="flex flex-col h-full">
      <div class="p-4 border-b">
        <h2 class="text-lg font-semibold">Utilisateurs</h2>
      </div>
      <div class="overflow-y-auto flex-1">
        <ul id="contact-list">
          <!-- Liste des contacts à charger dynamiquement -->
        </ul>
      </div>
    </div>
  `;
}
