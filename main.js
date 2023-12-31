import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import fs from 'node.fs';
import path from 'node:path';
import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from 'node:url';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents] });
client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Commands - Iterates through the commands folders and creates commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Commands
import createEvent from "./commands/test/createEvent.js"
import ping from "./commands/test/ping.js";

import addContent from './commands/content/addContent.js';
import editContent from './commands/content/editContent.js';
import deleteContent from './commands/content/deleteContent.js';
import showContent from './commands/content/showContent.js';

import addDate from './commands/watch_dates/addDate.js';
import deleteDate from './commands/watch_dates/deleteDate.js';
import editDate from './commands/watch_dates/editDate.js';
import getCronJobs from './commands/cron/getCronJobs.js';

import addChannel from './commands/channels/addChannel.js';
import deleteChannel from './commands/channels/deleteChannel.js';



const commandList = [createEvent, ping,
	addContent, editContent, deleteContent, showContent,
	addDate, deleteDate, editDate,
	addChannel, deleteChannel,
	getCronJobs];

for (let i = 0; i < commandList.length; i++) {
	const command = commandList[i];

	if (command.data && command.execute)
		client.commands.set(command.data.name, command);
	else
		console.log("Cannot load the command: ", command);
}

// Events
import ready from "./events/ready.js";
import addDateEvent from './events/addDateEvent.js';
import sequelize from './database.js';

const eventList = [ready, addDateEvent]

for (let i = 0; i < eventList.length; i++) {
	const event = eventList[i];

	if (event.once)
		client.once(event.name, (...args) => event.execute(...args, sequelize));
	else if (event)
		client.on(event.name, (...args) => event.execute(...args))
	else
		console.log("Event has failed: ", event)
}


// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = filePath.toString();


// 		// fs.readFile(command, (err, data) => {
// 		// 	const commandText = data.toString();
// 		// 	console.log(commandText.data);

// 		// 	if (commandText.includes('data') && commandText.includes('execute'))
// 		// 		client.commands.set(commandText.name, command);
// 		// })

// 		// console.log(command);

// 		// // Set a new item in the Collection with the key as the command name and the value as the exported module
// 		// if (command.includes('data') && command.includes('execute')) {
// 		// 	client.commands.set(command.data.name, command);
// 		// } else {
// 		// 	console.log(command);
// 		// 	console.log(filePath);
// 		// 	console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		// }
// 	}

// }


// // Events - Iterates through the event folders and creates the events
// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = filePath;

// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args, sequelize));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }


// Makes the slash commands work on discord
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
