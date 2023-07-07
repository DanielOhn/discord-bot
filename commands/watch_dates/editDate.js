import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Watch_Dates from '../../models/Watch_Dates.js';

const editDate = {
    data: new SlashCommandBuilder()
        .setName('edit-date')
        .setDescription('Edit a date from the database')
        .addIntegerOption(option =>
            option.setName("id")
                .setDescription("The id of the watch date")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("date")
                .setDescription("New date to update, in format: MM/DD/YYYY")
        ),
    async execute(interaction) {
        // Change date of id
        // Check if id is valid
        // Check if date is valid

        // Check if ID date and update date are the same
        // Update ID with the date

        const userInput = interaction.options.data

        let id = interaction.options.data[0].value;
        let date = interaction.options.data[1].value;
        let watchDate = undefined;
        let newDate;

        if (id) {
            watchDate = await Watch_Dates(sequelize).findByPk(id);
            
            if (watchDate === null) return interaction.reply(`This watch date id doesn't exist.`)

            const oldDate = watchDate.dataValues.date;
            newDate = new Date(date);

            if (+oldDate === +newDate) return interaction.reply("This date has already been set for the id.")
        }

        try {
            if (watchDate) {
                const updateDate = await Watch_Dates(sequelize).update({
                    date: newDate
                }, { where: { id: id } })

                return interaction.reply(`#${id} watch date has been updated to ${date}`);
            }

        } catch (err) {
            console.log("Couldn't update the watch date, shits fucked yo! ", err);
        }
    },
};


export default editDate;