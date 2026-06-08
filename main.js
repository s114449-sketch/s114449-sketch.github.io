import {
    auth
}
from "./firebaseConfig.js";

let animeList =
JSON.parse(
localStorage.getItem(
"animeList"
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

loadTags();

renderLibrary();

document
.getElementById(
"searchBtn"
)
.addEventListener(
"click",
searchAnime
);

async function searchAnime(){

    const keyword =
    document
    .getElementById(
    "searchInput"
    )
    .value
    .trim();

    if(!keyword)
    return;

    const query = `
    query ($search:String){

      Page(page:1,perPage:20){

        media(
          search:$search,
          type:ANIME
        ){

          id

          episodes

          averageScore

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

    const result =
    await response.json();

    renderSearchResult(
    result.data.Page.media
    );
}

function renderSearchResult(
animeArray
){

    const container =
    document
    .getElementById(
    "searchResult"
    );

    container.innerHTML="";

    animeArray.forEach(
    anime=>{

      container.innerHTML += `
      <div class="anime-card">

        <img src="${anime.coverImage.large}">

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
        onclick="addAnime(
        ${anime.id},
        '${anime.title.native || anime.title.romaji}',
        '${anime.coverImage.large}',
        ${anime.episodes || 0}
        )">

        加入收藏

        </button>

      </div>
      `;
    });
}

window.addAnime =
function(
id,
title,
image,
episodes
){

animeList.push({

id,

title,

image,

episodes,

currentEpisode:0,

score:0,

status:"收藏",

tags:[]
});

saveData();

renderLibrary();
};

function renderLibrary(){

const container =
document
.getElementById(
"animeLibrary"
);

container.innerHTML="";

animeList.forEach(
anime=>{

const percent =
anime.episodes
?
anime.currentEpisode
/
anime.episodes
*
100
:
0;

container.innerHTML += `
<div class="anime-card">

<img src="${anime.image}">

<h3>${anime.title}</h3>

<p>
${anime.currentEpisode}
/
${anime.episodes}
集
</p>

<div class="progress">

<div
class="progress-bar"
style="
width:${percent}%">
</div>

</div>

<p>
${anime.status}
</p>

<div class="card-buttons">

<button
onclick="
increaseEpisode(
${anime.id}
)">

+1集

</button>

</div>

</div>
`;
});
}

window.increaseEpisode =
function(id){

const anime =
animeList.find(
a=>a.id===id
);

anime.currentEpisode++;

if(
anime.currentEpisode
>=
anime.episodes
&&
anime.episodes > 0
){

anime.status =
"已看完";

}

saveData();

renderLibrary();
};

function saveData(){

localStorage.setItem(

"animeList",

JSON.stringify(
animeList
)

);
}

function loadTags(){

const select =
document.getElementById(
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
}
