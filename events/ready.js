import { Events } from 'discord.js';
import Content from '../models/Content.js';
import Watch_Dates from '../models/Watch_Dates.js';
import Content_Types from '../models/Content_Types.js';

const ready = {
	name: Events.ClientReady,
	once: true,
	async execute(client, sequelize) {
		try {
			await sequelize.authenticate();
			console.log("DB Connection Established");

			await Content_Types(sequelize).sync()
				.then(() => console.log("Content_Types Table has synced."))
				.catch((err) => console.log(err));
			await Watch_Dates(sequelize).sync().then(() => console.log("Watch_Dates Table has synced.")).catch((err) => console.log("Watch: ", err));;
			await Content(sequelize).sync().then(() => console.log("Content Table has synced.")).catch((err) => console.log("Content: ", err));;

			console.log(`Ready! Logged in as ${client.user.tag}`);
		} catch (err) {
			console.error("Unable to connect to database: ", err);
		}
	},
};


export default ready