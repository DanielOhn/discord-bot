import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';

const editContent = {
    data: new SlashCommandBuilder()
        .setName('edit-content')
        .setDescription('Edit a movie or a show to the database.')
        .addIntegerOption(option =>
            option.setName("content_id")
                .setDescription("The ID of content bruh")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Update title of the content.")
        )
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Update media type.")
                .addChoices(
                    { name: "Movie", value: "Movie" },
                    { name: "Show", value: "Show" },
                )
        ),
    async execute(interaction) {
        const userInput = interaction.options.data
        const getId = userInput[0].value
        const oldContent = await Content(sequelize).findByPk(getId)

        if (oldContent === null) return interaction.reply("Cannot find that content.");

        let updateName = oldContent.dataValues.name
        let updateType = oldContent.dataValues.media
        
        for (let i in userInput) {
            if (userInput[i].name === "title")
                updateName = userInput[i].value
            
            if (userInput[i].name === "type")
                updateType = userInput[i].value
        }

        try {
            if (updateName || updateType) {
                const updateContent = await Content(sequelize).update({
                    name: updateName,
                    media: updateType
                }, { where: { id: getId } });

                return interaction.reply(`Updated Content #${getId} to ${updateName} as a ${updateType}.`);
            } else {
                return interaction.reply(`You need to insert a new title or a media type.`)
            }
        } catch (err) {
            console.log(`Couldn't update ${getId}, shits fucked yo! `, err);
        }
    },
};


export default editContent;