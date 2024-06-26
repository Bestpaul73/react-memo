export async function getLeaders() {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard");
  if (!response.ok) {
    throw new Error("Ошибка загрузки лидеров");
  }
  const leaders = await response.json();
  console.log(leaders);
  return leaders;
}

export async function addLeader({ name, time, achievements }) {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({ name, time }),
  });
  if (!response.ok) {
    throw new Error("Ошибка отправки результата игры на сервер");
  }
  const newLeaders = await response.json();
  return newLeaders;
}
