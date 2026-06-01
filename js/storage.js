export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

export function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}

export function setLoggedInUser(username) {
  localStorage.setItem("loggedInUser", username);
}

export function removeLoggedInUser() {
  localStorage.removeItem("loggedInUser");
}
