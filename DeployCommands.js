import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
dotenv.config();

import createEvent from "./commands/test/createEvent.js";
import ping from "./commands/test/ping.js";

import addContent from "./commands/content/addContent.js";
import editContent from "./commands/content/editContent.js";
import deleteContent from "./commands/content/deleteContent.js";
import showContent from "./commands/content/showContent.js";

import addDate from "./commands/watch_dates/addDate.js";
import deleteDate from "./commands/watch_dates/deleteDate.js";
import editDate from "./commands/watch_dates/editDate.js";
import getCronJobs from "./commands/cron/getCronJobs.js";

import addChannel from "./commands/channels/addChannel.js";
import deleteChannel from "./commands/channels/deleteChannel.js";

const commands = []
const commandList = [createEvent, ping,
	addContent, editContent, deleteContent, showContent,
	addDate, deleteDate, editDate,
	addChannel, deleteChannel,
	getCronJobs]

for (let i = 0; i < commandList.length; i++) {
	const command = commandList[i];

	if (command.data && command.execute)
		commands.push(command.data.toJSON());
	else
		console.log("Something went wrong :c ", command);
}

// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);

// 		if ('data' in command && 'execute' in command)
// 			commands.push(command.data.toJSON());
// 		else
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
// 	}
// }

console.log(commands);

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.APPLICATION_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();