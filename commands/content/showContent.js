import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
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

        const results = new EmbedBuilder()

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

            if (idContent) {
                let data = idContent.dataValues
                results.setTitle(`#${data.id}: ${data.name}`)
                results.addFields({ name: "Media", value: `${data.media}`, inline: true })
                results.addFields({ name: `Seen`, value: `${data.seen} time(s)`, inline: true });

                if (data.seen > 0)
                    results.addFields({ name: "Watch Dates", value: "None"})
                    
                return interaction.reply({ embeds: [results] })
            }

            let listContent;

            if (getType) {
                listContent = await Content(sequelize).findAll({ where: { media: getType } })
                results.setTitle(`${getType}s`)
            }
            else {
                listContent = await Content(sequelize).findAll()
                results.setTitle("Movies/Shows")
            }

            for (let i in listContent) {
                if (i > 7) {
                    return interaction.reply({ embeds: [results] });
                }

                let data = listContent[i].dataValues
                results.addFields({ name: "Title", value: `#${data.id}: ${data.name}`, inline: true })
                results.addFields({ name: "Media", value: `${data.media}`, inline: true })
                results.addFields({ name: `Seen`, value: `${data.seen} time(s)`, inline: true });

                // if (data.seen > 0) {
                //     results.addFields({ name: "Last Watched", value: `${data.updatedAt}`, inline: true })
                // }
            }

            return interaction.reply({ embeds: [results] });
        } catch (err) {
            console.log("Couldn't show it to the db, shits fucked yo! ", err);
        }
    },
};


export default showContent;