import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';

const addContent = {
    data: new SlashCommandBuilder()
        .setName('add-content')
        .setDescription('Add a movie or a show to the database.')
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Title of the movie or show")
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Set if it's a movie or show. Defaults as a movie.")
                .addChoices(
                    { name: "Movie", value: "Movie" },
                    { name: "Show", value: "Show" },
                )
            ),
    async execute(interaction) {
        const getName = interaction.options.data[0].value
        const getType = interaction.options.data[1].value

        try {
            const content = await Content(sequelize).create({
                name: getName,
                media: getType
            });

            return interaction.reply(`#${content.dataValues.id} - ${getName} has been added.`);
        } catch (err) {
            console.log("Couldn't add it to the db, shits fucked yo! ", err);
        }
    },
};


export default addContent;