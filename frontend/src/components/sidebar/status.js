export function renderStatuses(users) {
  return fetch("http://localhost:3001/statuses")
    .then((res) => res.json())
    .then((statuses) => {
      // console.log("✅ STATUSES CHARGÉS :", statuses);
      // console.log("👤 UTILISATEURS DISPONIBLES :", users);

      const list = users
        .map((user) => {
          const userStatus = statuses.find(
            (s) => Number(s.userId) === Number(user.id)
          );
          // console.log(
          //   `🔍 User ${user.name} (${user.id}) a un statut ?`,
          //   userStatus
          // );

          if (!userStatus) return "";

          return `
          <li class="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
              data-user='${JSON.stringify(user)}'
              data-status='${JSON.stringify(userStatus)}'>
            <img src="${user.avatar}" alt="${
            user.name
          }" class="w-10 h-10 rounded-full ring-2 ring-green-500" />
            <div>
              <div class="font-medium">${user.name}</div>
              <div class="text-sm text-gray-500">Voir statut</div>
            </div>
          </li>
        `;
        })
        .join("");

      return `<ul id="status-list" class="divide-y divide-gray-200">${list}</ul>`;
    });
}
