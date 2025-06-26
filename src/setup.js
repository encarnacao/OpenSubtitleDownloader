import { exec } from "child_process";
import { openSubtitlesLogin } from "./apis/openSubtitles.js";
import dotenv from "dotenv";

dotenv.config();

export async function setup() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Token needs to be regenerated every 24 hours, so we check if the token is older than yesterday. First token is generated on the first run.
  const oldDate = process.env.TOKEN_DATE
    ? new Date(process.env.TOKEN_DATE)
    : yesterday;


  if (oldDate <= yesterday || isNaN(oldDate.getTime())) {
    const currToken = await openSubtitlesLogin(process.env.OSUB_USERNAME, process.env.OSUB_PASSWORD);
    // const currToken = "mocked_token_for_testing-12345"; // Mocked token for testing purposes
    const currDate = new Date();

    const psCommandToken = `[System.Environment]::SetEnvironmentVariable('JWT_TOKEN','${currToken}','User');`;
    const psCommandDate = `[System.Environment]::SetEnvironmentVariable('TOKEN_DATE','${currDate.toISOString()}','User');`;
    const psCommand = `${psCommandToken} ${psCommandDate}`;

    // Using PowerShell to set environment variables for the user scope. We need to make sure to know when the last token was generated, so this ensures that the next time the script is run, it will check if the token is still valid or not.

    exec(
      `powershell.exe -NoProfile -Command "${psCommand}"`,
      (err, stdout, stderr) => {
        if (err) console.error("PS Error:", err);
        if (stderr) console.error("PS stderr:", stderr);
      }
    );

    console.log(currToken);
    return 1;
  } else {
    //Jogando token no stdout
    console.log(process.env.JWT_TOKEN);
    return 1;
  }
}


await setup();