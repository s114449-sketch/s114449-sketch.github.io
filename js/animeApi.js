export async function searchAnime(name) {
  if (!name) return alert("請輸入動漫名稱");

  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        title { romaji native english }
        episodes
        averageScore
        description
        status
        coverImage { large }
      }
    }
  `;
  const variables = { search: name };
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  const data = await res.json();
  return data.data.Media;
}

export async function loadSeasonAnime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const season = month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL";

  const query = `{ Page(page:1, perPage:20){ media(season:${season}, seasonYear:${year}, type:ANIME){ title { romaji native } coverImage { large } episodes averageScore } } }`;

  const res = await fetch("https://graphql.anilist.co", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return data.data.Page.media;
}
