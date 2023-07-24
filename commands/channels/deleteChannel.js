import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Channels from '../../models/Channels.js';

const deleteChannel = {
    data: new SlashCommandBuilder()
        .setName('delete-channel')
        .setDescription('Delete your current channel id'),
    async execute(interaction) {
        try {
            const checkChannel = await Channels(sequelize).findOne({ guild_id: interaction.guildId })

            if (checkChannel) {
                const deleteChannel = await Channels(sequelize).delete({ where: { guild_id: interaction.guildId }})
                return interaction.reply('Deleted channel default.')
            }

            return interaction.reply(`This discord server doesn't have a set channel yet.`);

        } catch (err) {
            console.log("Couldn't add it to the db, shits fucked yo! ", err);
        }
    },
};


export default deleteChannel;