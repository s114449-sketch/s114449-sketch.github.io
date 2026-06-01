import { getUsers, setUsers, getLoggedInUser } from './storage.js';

export function applyTheme() {
  const username = getLoggedInUser();
  const users = getUsers();
  if (username && users[username]?.darkMode) document.body.classList.add("dark");
  else document.body.classList.remove("dark");
}

export function toggleTheme() {
  document.body.classList.toggle("dark");
  const username = getLoggedInUser();
  if (!username) return;

  const users = getUsers();
  users[username].darkMode = document.body.classList.contains("dark");
  setUsers(users);
}
