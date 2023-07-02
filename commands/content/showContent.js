import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';

const showContent = {
    data: new SlashCommandBuilder()
        .setName('display-content')
        .setDescription('Show all the movies or shows we have stored.')
        .addStringOption(option =>
            option.setName("type")
                .setDescription("List all movies or shows in the list.")
                .addChoices(
                    { name: "Movie", value: "Movie" },
                    { name: "Show", value: "Show" },
                )
        )
        .addIntegerOption(option =>
            option.setName("content_id")
                .setDescription("The id of the movie or show")),
    async execute(interaction) {

        const userInput = interaction.options.data

        let getType = undefined
        let getId = undefined

        for (let i in userInput) {
            if (userInput[i].name === "type")
                getType = userInput[i].value

            if (userInput[i].name === "content_id")
                getId = userInput[i].value
        }

        try {
            const idContent = await Content(sequelize).findByPk(getId);
            if (idContent) return interaction.reply(`${JSON.stringify(idContent.dataValues)}`);

            let listContent;

            if (getType)
                listContent = await Content(sequelize).findAll({ where: { media: getType } })
            else
                listContent = await Content(sequelize).findAll()

            return interaction.reply(JSON.stringify(listContent));
        } catch (err) {
            console.log("Couldn't show it to the db, shits fucked yo! ", err);
        }
    },
};


export default showContent;