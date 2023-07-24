import { SlashCommandBuilder } from 'discord.js';
import sequelize from '../../database.js';
import Channels from '../../models/Channels.js';

const addChannel = {
    data: new SlashCommandBuilder()
        .setName('add-channel')
        .setDescription('Add a channel id')
        .addStringOption(option =>
            option.setName("channel_id")
                .setDescription("Add or update the channel id.")
                .setRequired(true),
        ),
    async execute(interaction) {

        let getId = interaction.options.data[0].value

        try {
            const checkChannel = await Channels(sequelize).findOne({ guild_id: interaction.guildId })

            if (checkChannel) {
                const updateChannel = await Channels(sequelize).update({
                    channel_id: getId
                }, { where: { guild_id: interaction.guildId } })
                return interaction.reply('Updated channel default.')
            }
            else {
                const newChannel = await Channels(sequelize).create({ guild_id: interaction.guildId, channel_id: getId });

                return interaction.reply(`Added channel default.`);
            }

        } catch (err) {
            console.log("Couldn't add it to the db, shits fucked yo! ", err);
        }
    },
};


export default addChannel;