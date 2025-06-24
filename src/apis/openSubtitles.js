import axios from "axios";

const BASE_URL = "https://api.opensubtitles.com/api/v1";

export async function openSubtitlesLogin(username, password) {
  const response = await axios.post(
    `${BASE_URL}/login`,
    {
      username:username,
      password:password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "OpenSubtitlesDownloader v1.0",
        "Api-Key": process.env.API_KEY,
      },
    }
  );
  if (response.data && response.data.token) {
    return response.data.token;
  } else {
    throw new Error("Login failed: No token received");
  }
}

export async function openSubtitlesSearch(episodeNumber, seasonNumber, languages, imdbId, jwtToken) {
  /*
   * This function can be adapted to search for subtitles using different parameters.
   * Check the OpenSubtitles API documentation for more details on available parameters.
   * https://opensubtitles.stoplight.io/docs/opensubtitles-api/a172317bd5ccc-search-for-subtitles
   */ 
  
  const params = { episode_number: episodeNumber, season_number: seasonNumber, languages, parent_imdb_id: imdbId }
  const response = await axios.get(`${BASE_URL}/subtitles`, {
    params,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      "User-Agent": "OpenSubtitlesDownloader v1.0",
      "Api-Key": process.env.API_KEY,
    },
  });
  if (response.data.total_count === 0) {
    throw new Error("No subtitles found for the given query.");
  }
  return response.data;
}

export async function openSubtitlesDownload(fileId, jwtToken) {
  const response = await axios.post(
    `${BASE_URL}/download`,
    {
      file_id: parseInt(fileId),
    },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
        "User-Agent": "OpenSubtitlesDownloader v1.0",
        "Api-Key": process.env.API_KEY,
        "Accept": "*/*", 
      },
    }
  );
  if (response.data && response.data.link) {
    return response.data.link;
  } else {
    throw new Error("Download failed: No link received");
  }
}
