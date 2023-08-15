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

			console.log(getContent)

			const watchDate = new Date(client.scheduledStartTimestamp);

			console.log("WATCH DATE: ", watchDate)

			// Sets the cron job date + time
			let jobDate = new Date(watchDate.getDate() + 1)
			jobDate.setHours(1)
			jobDate.setMinutes(0)

			watchDate.setSeconds(0)
			watchDate.setMinutes(0)
			watchDate.setHours(1)
			watchDate.setMilliseconds(0)

			console.log(jobDate)

			const job = cron.scheduleJob(jobDate, async () => {
				let contentIds = [];

				if (getContent.length === 2) {
					let getContentIds = await Content(sequelize).findAll({
						where: {
							name: {
								[Op.or]: [getContent[0], getContent[1]]
							}
						}
					})
					contentIds.push(getContentIds[0].dataValues.id);
					contentIds.push(getContentIds[1].dataValues.id);

				} else if (getContent.legnth === 1) {
					let getContentIds = await Content(sequelize).findOne({
						where: { name: getContent[0] }
					})

					contentIds.push(getContentIds.dataValues.id);
				}

				//Create new Watch Dates for each media in the scheduled event
				for (let i in contentIds) {
					let newWatchdate = await Watch_Dates(sequelize).create({ content_id: contentIds[i], date: watchDate })
				}

			})
		} catch (err) {
			console.error("Unable to create the scheduled event: ", err);
		}
	},
};


export default addDateEvent