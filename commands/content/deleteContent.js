import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';

const deleteContent = {
    data: new SlashCommandBuilder()
        .setName('delete-content')
        .setDescription('Delete an item from the database.')
        .addIntegerOption(option =>
            option.setName("content_id")
                .setDescription("The id of the movie or show")
                .setRequired(true),
        ),
    async execute(interaction) {
        const getId = interaction.options.data[0].value
        const oldContent = await Content(sequelize).findByPk(getId);

        if (oldContent === null) return interaction.reply(`Couldn't find any content by id: #${getId}`)

        try {
            const { name } = oldContent.dataValues;

            const deleteContent = await Content(sequelize).destroy({
                where: { id: getId }
            });

            return interaction.reply(`#${getId} - ${name} has been deleted..`);
        } catch (err) {
            console.log("Couldn't delete the content, shits fucked yo! ", err);
        }
    },
};


export default deleteContent;