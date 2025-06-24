import fs from "fs";
import path from "path";
import axios from "axios";

export function generateParams(fileName) {
  /*
   * This function generates the parameters needed for the OpenSubtitles API search.
   * It extracts the season and episode numbers from the file name.
   * The file name is expected to be in the format "01x01 - Doctor Who - S01EO1 - Unearthly Child (1).avi".
   * Because Doctor Who has episodes grouped by story arcs (S01E01 doesn't mean it's the first episode)
   * I renamed the files to follow a specific pattern so I could use as parameters for the search.
   * according to the OpenSubtitles API documentation, the query parameter is used to search for subtitles.
   * Adjust this function according to your file naming convention.
   */

  const nameParts = fileName.split("-");
  // nameParts[0] is Season Number x Episode Number e.g. "01x01"
  const seasonEpisode = nameParts[0].trim();

  const seasonNumber = seasonEpisode.split("x")[0].trim();
  const episodeNumber = seasonEpisode.split("x")[1].trim();

  return {
    imdbId: "56751",
    languages: "en", // I'm only interested in English subtitles for now.
    episodeNumber,
    seasonNumber,
  };
}

export async function saveSubtitleFile(downloadLink, folderPath, fileName) {
  const fileNameWithoutExtension = path.basename(fileName, path.extname(fileName));
  const filePath = path.join(folderPath, `${fileNameWithoutExtension}.srt`);

  try {
    const response = await axios.get(downloadLink, {
      responseType: "stream",
    });

    // Save the subtitle file
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error saving subtitle file:", error);
    throw error;
  }
};