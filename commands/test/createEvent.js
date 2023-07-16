import { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } from 'discord.js';
import sequelize from '../../database.js';
import Content from '../../models/Content.js';

const createEvent = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Creates a  scheduled event!'),
    async execute(interaction) {

        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);

        const getAllMedia = await Content(sequelize).findAll();

        console.log(getAllMedia)

        const get_content = [
            getAllMedia[Math.floor(Math.random() * getAllMedia.length)].dataValues.name,
            getAllMedia[Math.floor(Math.random() * getAllMedia.length)].dataValues.name
        ]

        console.log(get_content);

        const event_name = ["Anime Night", "Movie Night", "Street Fighter Sundays"];

        var get_event_name = event_name[Math.floor(Math.random() * event_name.length)];
        var description = `Tonight we'll be watching: \n${get_content[Math.floor(Math.random() * get_content.length)]} \n${get_content[Math.floor(Math.random() * get_content.length)]}`

        if (!guild)
            return console.log('Guild not found');

        const event_manager = new GuildScheduledEventManager(guild);

        const date = new Date();
        date.setHours("23")
        date.setMinutes("45")
        date.setSeconds("00")

        await event_manager.create({
            name: get_event_name,
            scheduledStartTime: date,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
            description: description,
            channel: '638586352568369156',
            image: null,
            reason: 'Testing with creating a Scheduled Event',
        });

        await interaction.reply("Event Created!");
    }
};

export default createEvent;