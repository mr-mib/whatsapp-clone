export function renderHeader() {
  return `
    <header class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-full bg-green-500"></div>
        <span class="font-semibold">Nom du contact</span>
      </div>
      <div class="flex items-center gap-4 text-gray-500">
        <button title="Recherche"><i class="fa-solid fa-magnifying-glass"></i></button>
        <button title="Menu"><i class="fa-solid fa-ellipsis-v"></i></button>
      </div>
    </header>
  `;
}
