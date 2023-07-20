import { Events } from 'discord.js';
import * as cron from "node-schedule"
import sequelize from '../database.js';
import Content from '../models/Content.js';
import Watch_Dates from '../models/Watch_Dates.js';
import { Op } from "sequelize"
import { cron_jobs } from '../commands/cron/getCronJobs.js';
// import Content from '../models/Content.js';
// import Watch_Dates from '../models/Watch_Dates.js';

const addDateEvent = {
	name: Events.GuildScheduledEventCreate,
	async execute(client) {
		try {
			console.log(client);

			if (client.name !== "Anime Night")
				return
			console.log(`Event created:`);

			let getContent = client.description
			getContent = getContent.split("\n")
			getContent.shift()

			getContent = ["title", "Testing this out"]

			// Get date of event
			let media = [];

			for (let i = 0; i < getContent.length; i++) {
				media.push(getContent[i])
			}

			console.log(media);
			const watchDate = new Date(client.scheduledStartTimestamp);
			const newDate = new Date()
			newDate.setSeconds(newDate.getSeconds() + 3);
			

			watchDate.setSeconds(0);
			watchDate.setMinutes(0);
			watchDate.setHours(0);
			watchDate.setMilliseconds(0);

			const job = cron.scheduleJob(newDate, async () => {
				let contentIds = [];

				if (media.length === 2) {
					let getContentIds = await Content(sequelize).findAll({
						where: {
							name: {
								[Op.or]: [media[0], media[1]]
							}
						}
					})
					contentIds.push(getContentIds[0].dataValues.id);
					contentIds.push(getContentIds[1].dataValues.id);

				} else if (media.legnth === 1) {
					let getContentIds = await Content(sequelize).findOne({
						where: { name: media[0] }
					})

					contentIds.push(getContentIds.dataValues.id);
				}

				console.log("Content Ids: " + contentIds);

				// Create new Watch Dates for each media in the scheduled event
				for (let i in contentIds) {
					let newWatchdate = await Watch_Dates(sequelize).create({ content_id: contentIds[i], date: watchDate})

					// Check if created, if not then update it by incremneting the value by 1 
					console.log(newWatchdate)
				}


			})

			cron_jobs.set(cron_jobs.size+1, job)

		} catch (err) {
			console.error("Unable to create the scheduled event: ", err);
		}
	},
};


export default addDateEvent