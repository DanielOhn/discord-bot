import { Events, Routes } from 'discord.js';
import * as cron from "node-schedule"
import sequelize from '../database.js';
import Content from '../models/Content.js';
import Watch_Dates from '../models/Watch_Dates.js';
import { Op } from "sequelize"


const addDateEvent = {
	name: Events.GuildScheduledEventCreate,
	async execute(client) {
		try {
			if (client.name !== "Anime Night")
				return

			let getContent = client.description
			getContent = getContent.split("\n")
			getContent.shift()

			getContent = ["title", "Testing this out"]

			// Get date of event
			let media = [];

			for (let i = 0; i < getContent.length; i++) {
				media.push(getContent[i])
			}

			const watchDate = new Date(client.scheduledStartTimestamp);

			// Sets the cron job date + time
			const jobDate = new Date(watchDate.getDate() + 1)
			jobDate.setHours(1)
			jobDate.setMinutes(0)

			watchDate.setSeconds(0);
			watchDate.setMinutes(0);
			watchDate.setHours(0);
			watchDate.setMilliseconds(0);

			const job = cron.scheduleJob(jobDate, async () => {
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

				//Create new Watch Dates for each media in the scheduled event
				for (let i in contentIds) {
					let newWatchdate = await Watch_Dates(sequelize).create({ content_id: contentIds[i], date: watchDate})
				}

			})
		} catch (err) {
			console.error("Unable to create the scheduled event: ", err);
		}
	},
};


export default addDateEvent