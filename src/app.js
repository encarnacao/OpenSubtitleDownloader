import { setup } from "./setup.js";
import { generateParams, saveSubtitleFile } from "./utils/utils.js";
import { openSubtitlesSearch, openSubtitlesDownload } from "./apis/openSubtitles.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Getting path from command line arguments. As I'm going to control the arguments passed in the script, I am assuming the arguments are always valid.
  const fullPath = process.argv[2];

  // Separating the folder path and file name from the file path will be useful for later operations.
  const filePathArray = fullPath.split("\\");
  const fileName = filePathArray[filePathArray.length - 1];
  const folderPath = filePathArray.slice(0, -1).join("\\");

  // Running the setup 'cause we need a JWT Token for the download request.
  const token = await setup();

  console.log(`🎞️ File name: ${fileName}`);
  console.log(`📁 Folder: ${folderPath}`);
  const params = generateParams(fileName);
  try {

    const searchResults = await openSubtitlesSearch(
      params.episodeNumber,
      params.seasonNumber,
      params.languages,
      params.imdbId,
      token
    );

    // Here i'm going to filter the results also specifically to a user defined criteria.
    const filteredResults = searchResults.data.sort((a, b) => {
      // Sort by number of downloads in a.attributes.download_count. Descending order.
      return b.attributes.download_count - a.attributes.download_count;
    });
    const fileData = filteredResults[0].attributes.files[0];
    const fileId = fileData.file_id;
    const subFileName = fileData.file_name;
    if (!fileId) {
      console.error("❌ No subtitle file found for the given parameters.");
      return -1;
    }

    console.log("🔍 Found subtitle file: ", subFileName);

    const downloadLink = await openSubtitlesDownload(
      fileId,
      token
    );

    await saveSubtitleFile(downloadLink, folderPath, fileName);
    console.log("✅ Subtitle downloaded successfully for Episode:", fileName);
    return 0;

  } catch (err) {
    console.error("❌ ERROR:", err);
    return -1;
  }
}

await main();
