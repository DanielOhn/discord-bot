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
                .setDescription("Set the date, defaults to today. Format as MM/DD/YYY")
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
            // Find all and check by
            const checkDates = await Watch_Dates(sequelize).findAll({ where: { content_id: getId } })
            let setDate;

            if (getDate)
                setDate = new Date(getDate);
            else
                setDate = new Date()


            setDate.setHours(0, 0, 0, 0)

            for (let i in checkDates) {
                let check = checkDates[i];

                if (+check.date === +setDate)

                    if (content.dataValues.seen === 0) {
                        const updateContent = await Content(sequelize).edit({
                            seen: content.dataValues.seen + 1
                        }, { where: { id: content.dataValues.id } })

                        return interaction.reply("Date has been set already, updated the amount of times the content has been seen.")
                    }
                return interaction.reply(`That date has already been set for '${content.dataValues.name}'.`)
            }

            const addWatchDate = await Watch_Dates(sequelize).create({
                content_id: getId,
                date: setDate
            });

            const updateContent = await Content(sequelize).edit({
                seen: content.dataValues.seen + 1
            }, { where: { id: content.dataValues.id } })

            return interaction.reply(`#${content.dataValues.id} - ${content.dataValues.name} has been seen on ${setDate.getMonth() + 1}/${setDate.getDay() + 2}/${setDate.getFullYear()}.`);

        } catch (err) {
            console.log("Couldn't add it to the db, shits fucked yo! ", err);
        }
    },
};


export default addDate;