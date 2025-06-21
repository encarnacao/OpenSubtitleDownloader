# OpenSubtitle Downloader - WIP

As I am writing this README, I am only planning to work on this as a personal project to 

1) Learn how to work with CMD and Windows Registry
2) Have less work when watching Doctor Who episodes. There are 26 seasons and I don't want to download subtitles for each episode manually.

Because of that there will be one specific use case for this project, which is downloading subtitles for Doctor Who episodes. That means the part of the code that defines the query will be specific to how my episodes are named. I will, however, try to make the code as generic as possible so that it can be used for other series as well, but that part will need to be modified to each case. As I'm also not planning to make a GUI for this, it means some coding and Windows knowledge is required to use this project.

The aim is to have a script that will be added to the context menu of Windows Explorer, so that when I right-click on a folder containing Doctor Who episodes, I can select "Download Subtitles" and it will automatically download the subtitles for all episodes in that folder, rename them to match the episode names, and save them in the same folder.

For that I will be using a combination of Node.js (only because I'm already familiarized with it and I thought writing a code in JavaScript would be better then doing everything using the bat file. Python would be probably faster for most people, but I haven't coded in Python for a while), a bat file that will run through the folder and call the Node.js script for each episode, and a Windows Registry entry that will add the context menu option.