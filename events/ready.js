import { Events } from 'discord.js';
import Channels from '../models/Channels.js';
import Content from '../models/Content.js';
import Watch_Dates from '../models/Watch_Dates.js';

const ready = {
	name: Events.ClientReady,
	once: true,
	async execute(client, sequelize) {
		try {
			await sequelize.authenticate();
			console.log("DB Connection Established");

			await Content(sequelize).sync({ force: false })
				.then(() => console.log("Content Table has synced."))
				.catch((err) => console.log("Content Error: ", err));;

			await Watch_Dates(sequelize).sync({ force: false })
				.then(() => console.log("Watch_Dates Table has synced."))
				.catch((err) => console.log("Watch Dates Error: ", err));;

			await Channels(sequelize).sync({ force: false })
				.then(() => console.log("Channels Table has synced."))
				.catch((err) => console.log("Channels Error: ", err));;

			console.log(`Ready! Logged in as ${client.user.tag}`);
		} catch (err) {
			console.error("Unable to connect to database: ", err);
		}
	},
};


export default ready