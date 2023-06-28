const { Events } = require('discord.js');
import Content from '../models/Content';
import Watch_Dates from '../models/Watch_Dates';
import Content_Types from '../models/Content_TypeS';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		Content_Types.sync();
		Watch_Dates.sync();
		Content.sync();

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
