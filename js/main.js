import * as Auth from './auth.js';
import * as Theme from './theme.js';
import * as Api from './animeApi.js';
import * as Tracker from './tracker.js';

// DOM 元素
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");
const searchBtn = document.getElementById("searchBtn");
const seasonBtn = document.getElementById("seasonBtn");
const animeNameInput = document.getElementById("animeName");

// 綁定事件
registerBtn.onclick = () => Auth.register(usernameInput.value, passwordInput.value);
loginBtn.onclick = () => {
  if(Auth.login(usernameInput.value, passwordInput.value)) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    Theme.applyTheme();
    renderSavedAnime();
  }
};
logoutBtn.onclick = () => Auth.logout();
toggleThemeBtn.onclick = () => Theme.toggleTheme();
searchBtn.onclick = async () => renderSearchResult(await Api.searchAnime(animeNameInput.value));
seasonBtn.onclick = async () => renderSearchResult(await Api.loadSeasonAnime());

// 載入追番清單
function renderSavedAnime()
