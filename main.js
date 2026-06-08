// =====================
// Anime Tracker
// =====================

let animeList =
JSON.parse(
localStorage.getItem(
"animeList"
)
) || [];

let searchHistory =
JSON.parse(
localStorage.getItem(
"searchHistory"
)
) || [];

const TAGS = [

"戀愛",
"校園",

"異世界",
"奇幻",

"冒險",
"戰鬥",

"推理",
"懸疑",

"日常",
"治癒",

"音樂",
"運動"

];

const STATUS = [

"收藏",
"想看",
"追番中",
"已看完",
"棄坑"

];

// =====================
// Init
// =====================

document
.addEventListener(
"DOMContentLoaded",
init
);

function init(){

    initTheme();

    loadTags();

    renderLibrary();

    renderSearchHistory();

    updateStats();

    bindEvents();
}

// =====================
// Event Binding
// =====================

function bindEvents(){

    document
    .getElementById(
    "searchBtn"
    )
    .addEventListener(
    "click",
    handleSearch
    );

    document
    .getElementById(
    "themeToggle"
    )
    .addEventListener(
    "click",
    toggleTheme
    );
}

// =====================
// Theme
// =====================

function initTheme(){

    const theme =
    localStorage.getItem(
    "theme"
    );

    if(theme === "dark"){

        document.body
        .classList.add(
        "dark"
        );

    }
}

function toggleTheme(){

    document.body
    .classList.toggle(
    "dark"
    );

    const isDark =
    document.body
    .classList.contains(
    "dark"
    );

    localStorage.setItem(

    "theme",

    isDark
    ?
    "dark"
    :
    "light"

    );
}

// =====================
// Search Anime
// =====================

async function handleSearch(){

    const keyword =
    document
    .getElementById(
    "searchInput"
    )
    .value
    .trim();

    if(!keyword)
    return;

    saveSearchHistory(
    keyword
    );

    const query = `
    query ($search:String){

      Page(
        page:1,
        perPage:20
      ){

        media(

          search:$search,

          type:ANIME

        ){

          id

          episodes

          averageScore

          genres

          title{

            native

            romaji

          }

          coverImage{

            large

          }
        }
      }
    }
    `;

    try{

        const response =
        await fetch(
        "https://graphql.anilist.co",
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                query,

                variables:{
                    search:keyword
                }

            })

        });

        const data =
        await response.json();

        renderSearchResult(

        data.data.Page.media

        );

    }
    catch(error){

        console.error(error);

        alert(
        "搜尋失敗"
        );

    }
}
// =====================
// Search Result
// =====================

function renderSearchResult(
animeArray
){

    const container =
    document
    .getElementById(
    "searchResult"
    );

    container.innerHTML = "";

    animeArray.forEach(
    anime => {

        container.innerHTML += `

        <div class="anime-card">

            <img
            src="${anime.coverImage.large}">

            <h3>

            ${
            anime.title.native
            ||
            anime.title.romaji
            }

            </h3>

            <p>

            📺
            ${anime.episodes || "?"}
            集

            </p>

            <p>

            ⭐
            ${
            anime.averageScore
            || "-"
            }

            </p>

            <button

            class="btn-primary"

            onclick="
            addAnime(
            ${anime.id},
            '${anime.title.native || anime.title.romaji}',
            '${anime.coverImage.large}',
            ${anime.episodes || 0}
            )">

            加入清單

            </button>

        </div>

        `;
    });
}

// =====================
// Add Anime
// =====================

window.addAnime =
function(

id,
title,
image,
episodes

){

    const exists =
    animeList.find(
    anime =>
    anime.id === id
    );

    if(exists){

        alert(
        "已存在"
        );

        return;
    }

    animeList.push({

        id,

        title,

        image,

        episodes,

        currentEpisode:0,

        score:0,

        status:"想看",

        tags:[]

    });

    saveData();

    renderLibrary();

    updateStats();
};
// =====================
// LocalStorage
// =====================

function saveData(){

    localStorage.setItem(

    "animeList",

    JSON.stringify(
    animeList
    )

    );
}

// =====================
// Search History
// =====================

function saveSearchHistory(
keyword
){

    searchHistory =
    searchHistory.filter(
    item =>
    item !== keyword
    );

    searchHistory.unshift(
    keyword
    );

    searchHistory =
    searchHistory.slice(
    0,
    10
    );

    localStorage.setItem(

    "searchHistory",

    JSON.stringify(
    searchHistory
    )

    );

    renderSearchHistory();
}

function renderSearchHistory(){

    const container =
    document
    .getElementById(
    "searchHistory"
    );

    container.innerHTML = "";

    searchHistory.forEach(
    keyword=>{

        container.innerHTML += `
        <div

        class="history-item"

        onclick="
        quickSearch(
        '${keyword}'
        )">

        ${keyword}

        </div>
        `;
    });
}

window.quickSearch =
function(keyword){

    document
    .getElementById(
    "searchInput"
    )
    .value =
    keyword;

    handleSearch();
};
// =====================
// Render Library
// =====================

function renderLibrary(){

    const sections = {

        "想看":
        document.getElementById(
        "planList"
        ),

        "追番中":
        document.getElementById(
        "watchingList"
        ),

        "收藏":
        document.getElementById(
        "favoriteList"
        ),

        "已看完":
        document.getElementById(
        "completedList"
        ),

        "棄坑":
        document.getElementById(
        "droppedList"
        )
    };

    Object.values(
    sections
    ).forEach(
    section =>
    section.innerHTML = ""
    );

    animeList.forEach(
    anime=>{

        const target =
        sections[
        anime.status
        ];

        if(target){

            target.innerHTML +=
            createAnimeCard(
            anime
            );

        }

    });
}

// =====================
// Card
// =====================

function createAnimeCard(
anime
){

    const percent =
    anime.episodes > 0
    ?
    (
        anime.currentEpisode
        /
        anime.episodes
    ) * 100
    :
    0;

    return `

    <div class="anime-card">

        <img
        src="${anime.image}">

        <h3>
        ${anime.title}
        </h3>

        <p>
        📺
        ${anime.currentEpisode}
        /
        ${anime.episodes || "?"}
        集
        </p>

        <div class="progress">

            <div
            class="progress-bar"
            style="
            width:${percent}%">
            </div>

        </div>

        <div class="rating">

            ⭐ 評分：

            <input

            type="number"

            min="0"

            max="10"

            value="${anime.score}"

            onchange="
            updateScore(
            ${anime.id},
            this.value
            )">

        </div>

        <div class="tag-container">

        ${
        anime.tags
        .map(
        tag =>
        `<span class="tag">
        ${tag}
        </span>`
        )
        .join("")
        }

        </div>

        <select

        class="status-select"

        onchange="
        changeStatus(
        ${anime.id},
        this.value
        )">

        ${STATUS.map(
        status =>

        `
        <option

        value="${status}"

        ${
        anime.status === status
        ?
        "selected"
        :
        ""
        }

        >

        ${status}

        </option>
        `
        ).join("")
        }

        </select>

        <div class="card-buttons">

            <button

            class="btn-success"

            onclick="
            increaseEpisode(
            ${anime.id}
            )">

            +1 集

            </button>

            <button

            class="btn-danger"

            onclick="
            removeAnime(
            ${anime.id}
            )">

            刪除

            </button>

        </div>

    </div>
    `;
}
// =====================
// Status
// =====================

window.changeStatus =
function(
id,
status
){

    const anime =
    animeList.find(
    anime =>
    anime.id === id
    );

    if(!anime)
    return;

    anime.status =
    status;

    saveData();

    renderLibrary();

    updateStats();
};

// =====================
// Episode
// =====================

window.increaseEpisode =
function(id){

    const anime =
    animeList.find(
    anime =>
    anime.id === id
    );

    if(!anime)
    return;

    anime.currentEpisode++;

    if(
    anime.episodes > 0
    &&
    anime.currentEpisode >= anime.episodes
    ){

        anime.status =
        "已看完";
    }

    saveData();

    renderLibrary();

    updateStats();
};
// =====================
// Score
// =====================

window.updateScore =
function(
id,
score
){

    const anime =
    animeList.find(
    anime =>
    anime.id === id
    );

    if(!anime)
    return;

    anime.score =
    Number(score);

    saveData();

    updateStats();
};

// =====================
// Delete
// =====================

window.removeAnime =
function(id){

    const result =
    confirm(
    "確定刪除？"
    );

    if(!result)
    return;

    animeList =
    animeList.filter(
    anime =>
    anime.id !== id
    );

    saveData();

    renderLibrary();

    updateStats();
};
// =====================
// Tags
// =====================

function loadTags(){

    const select =
    document
    .getElementById(
    "filterTag"
    );

    TAGS.forEach(
    tag=>{

        select.innerHTML +=
        `
        <option
        value="${tag}">
        ${tag}
        </option>
        `;
    });

    select.addEventListener(
    "change",
    filterByTag
    );
}

function filterByTag(){

    const selected =
    document
    .getElementById(
    "filterTag"
    )
    .value;

    if(!selected){

        renderLibrary();

        return;
    }

    const filtered =
    animeList.filter(
    anime =>
    anime.tags.includes(
    selected
    )
    );

    console.log(
    filtered
    );
}
// =====================
// Statistics
// =====================

function updateStats(){

    const stats = {

        收藏:0,

        想看:0,

        追番中:0,

        已看完:0,

        棄坑:0
    };

    let totalScore = 0;

    let scoreCount = 0;

    animeList.forEach(
    anime=>{

        stats[
        anime.status
        ]++;

        if(
        anime.score > 0
        ){

            totalScore +=
            anime.score;

            scoreCount++;
        }

    });

    const averageScore =
    scoreCount > 0
    ?
    (
        totalScore
        /
        scoreCount
    ).toFixed(1)
    :
    0;

    document
    .getElementById(
    "stats"
    )
    .innerHTML = `

    <div class="stat-card">
    ❤️ 收藏：
    ${stats["收藏"]}
    </div>

    <div class="stat-card">
    📌 想看：
    ${stats["想看"]}
    </div>

    <div class="stat-card">
    📺 追番中：
    ${stats["追番中"]}
    </div>

    <div class="stat-card">
    ✅ 已看完：
    ${stats["已看完"]}
    </div>

    <div class="stat-card">
    ❌ 棄坑：
    ${stats["棄坑"]}
    </div>

    <div class="stat-card">
    ⭐ 平均評分：
    ${averageScore}
    </div>

    `;
}
