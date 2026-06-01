import { getUsers, setUsers, setLoggedInUser, removeLoggedInUser } from './storage.js';

export function register(username, password) {
  if (!username || !password) return alert("請輸入帳號密碼");

  const users = getUsers();
  if (users[username]) return alert("帳號已存在");

  users[username] = { password, animeList: [], darkMode: false };
  setUsers(users);
  alert("註冊成功");
}

export function login(username, password) {
  const users = getUsers();
  const user = users[username];

  if (user && user.password === password) {
    setLoggedInUser(username);
    return true;
  } else {
    alert("帳號或密碼錯誤");
    return false;
  }
}

export function logout() {
  removeLoggedInUser();
  location.reload();
}
