import { getUsers, setUsers, getLoggedInUser } from './storage.js';

export function getAnimeList() {
  const users = getUsers();
  const username = getLoggedInUser();
  return users[username]?.animeList || [];
}

export function saveAnime(title, episodes, progress) {
  const users = getUsers();
  const username = getLoggedInUser();
  const user = users[username];
  const list = user.animeList;
  const idx = list.findIndex(a => a.title === title);
  if(idx>=0) list[idx].progress = progress;
  else list.push({ title, episodes, progress });

  users[username] = user;
  setUsers(users);
}

export function updateProgress(title, progress) {
  const users = getUsers();
  const username = getLoggedInUser();
  const user = users[username];
  const anime = user.animeList.find(a => a.title === title);
  if(anime) anime.progress = progress;

  users[username] = user;
  setUsers(users);
}

export function deleteAnime(title) {
  const users = getUsers();
  const username = getLoggedInUser();
  const user = users[username];

  user.animeList = user.animeList.filter(a => a.title !== title);
  users[username] = user;
  setUsers(users);
}
