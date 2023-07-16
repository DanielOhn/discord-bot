import { SlashCommandBuilder } from 'discord.js';

export const cron_jobs = new Map()

// key: id, value: cron job

const getCronJobs = {
	data: new SlashCommandBuilder()
		.setName('get-cron')
		.setDescription('Replies with the cron jobs!'),
	async execute(interaction) {

		try {
			console.log(cron_jobs)
			await interaction.reply("Got the logs");

		}
		catch(err) {
			console.log(err);
			await interaction.reply("Something went wrong");
		}
		
	},
};


export default getCronJobs;