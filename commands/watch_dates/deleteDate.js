import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Watch_Dates from '../../models/Watch_Dates.js';

const deleteDate = {
    data: new SlashCommandBuilder()
        .setName('delete-date')
        .setDescription('Delete a date from the database, or all dates associated with content id.')
        .addIntegerOption(option =>
            option.setName("id")
                .setDescription("The id of the watch date")
        )
        .addIntegerOption(option =>
            option.setName("content_id")
                .setDescription("The id of the movie or show")
        ),
    async execute(interaction) {
        const userInput = interaction.options.data

        let id = undefined;
        let contentId = undefined;

        for (let i in userInput) {
            if (userInput[i].name === "id")
                id = userInput[i].value

            if (userInput[i].name === "content_id")
                contentId = userInput[i].value
        }

        let watchDate = undefined;
        if (id) {
            watchDate = await Watch_Dates(sequelize).findByPk(id);
            if (watchDate === null) return interaction.reply(`This watch date id doesn't exist.`)
        }

        let watchDates = undefined;

        if (contentId) {
            watchDates = await Watch_Dates(sequelize).findAll({ where: { content_id: contentId } })    
            if (watchDates.length === 0) return interaction.reply(`Couldn't find any watch dates.`)
        }

        try {
            if (id && watchDate) {
                const deleteDate = await Watch_Dates(sequelize).destroy({
                    where: { id: id }
                })

                return interaction.reply(`#${id} watch date has been deleted..`);
            }
            
            if (contentId && watchDates) {
                const deleteDates = await Watch_Dates(sequelize).destroy({
                    where: { content_id: contentId }
                })

                return interaction.reply(`Deleted all of Content #${contentId}'s watch dates.`)
            }

        } catch (err) {
            console.log("Couldn't delete the content, shits fucked yo! ", err);
        }
    },
};


export default deleteDate;