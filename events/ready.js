const { Events } = require('discord.js');
import Content from '../models/Content';
import Watch_Dates from '../models/Watch_Dates';
import Content_Types from '../models/Content_TypeS';
import { sequelize } from '../main';

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try {
			await sequelize.authenticate();
			console.log("DB Connection Established");

			Content_Types.sync();
			Watch_Dates.sync();
			Content.sync();
	
			console.log(`Ready! Logged in as ${client.user.tag}`);
		} catch (err) {
			console.error("Unable to connect to database: ", err);
		}
	},
};
