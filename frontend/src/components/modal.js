export function showStatusModal(user, status) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50";
  modal.id = "status-modal";

  let contentHtml = "";
  if (status.type === "image") {
    contentHtml = `<img src="${status.content}" class="max-w-full max-h-full rounded" />`;
  } else if (status.type === "video") {
    contentHtml = `<video src="${status.content}" controls autoplay class="max-w-full max-h-full rounded"></video>`;
  } else {
    contentHtml = `<div class="text-white text-xl">${status.content}</div>`;
  }

  modal.innerHTML = `
    <div class="bg-gray-900 p-4 rounded flex flex-col items-center gap-4 max-w-lg w-full max-h-[90vh]">
      <div class="flex items-center gap-2">
        <img src="${user.avatar}" class="w-10 h-10 rounded-full" />
        <span class="text-white font-semibold">${user.name}</span>
      </div>
      ${contentHtml}
      <button class="mt-4 px-4 py-2 bg-red-500 text-white rounded" id="close-status">Fermer</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Fermeture manuelle
  document
    .getElementById("close-status")
    .addEventListener("click", () => modal.remove());
  // Clic en dehors
  modal.addEventListener("click", (e) => {
    if (e.target.id === "status-modal") modal.remove();
  });
  // ESC
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", escHandler);
    }
  });
}
