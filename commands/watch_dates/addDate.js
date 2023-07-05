import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';
import Watch_Dates from '../../models/Watch_Dates.js';

const addDate = {
    data: new SlashCommandBuilder()
        .setName('add-date')
        .setDescription('Add a watch date to a media.')
        .addIntegerOption(option =>
            option.setName("content_id")
                .setDescription("Id of the show/movie.")
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName("date")
                .setDescription("Set the date, defaults to today.")
                .setRequired(false),
            ),
    async execute(interaction) {

        let getId = interaction.options.data[0].value

        let getDate;
        if (interaction.options.data[1])
            getDate = interaction.options.data[1].value

        const content = await Content(sequelize).findByPk(getId);

        if (content === undefined) return interaction.reply(`Cannot find any media by ID: ${getId}`)

        try {
            const checkDate = await Watch_Dates(sequelize).findOne({where: { content_id: getId}})

            if (getDate === undefined)
                getDate = new Date();

            let year = getDate.getFullYear();
            let month = getDate.getMonth();
            let day = getDate.getDay();

            const setDate = new Date(day, month, year);

            if (checkDate && +checkDate.dataValues.date === +setDate) return interaction.reply(`That date has already been set for '${content.dataValues.name}'.`)

            const watch_times = await Watch_Dates(sequelize).create({
                content_id: getId,
                date: setDate
            });

            return interaction.reply(`#${content.dataValues.id} - ${content.dataValues.name} has been seen on ${month}/${day}/${year}.`);
        } catch (err) {
            console.log("Couldn't add it to the db, shits fucked yo! ", err);
        }
    },
};


export default addDate;