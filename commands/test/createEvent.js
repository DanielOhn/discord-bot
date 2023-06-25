const { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Creates a  scheduled event!'),
    async execute(interaction) {

        const guild = interaction.client.guilds.cache.get(process.env.GUILD_ID);


        const movies = ["Movie 1", "Movie 2", "Movie 3"];
        const anime = ["Anime 1", "Anime 2", "Anime 3"];
        const event_name = ["Anime Night", "Movie Night", "Street Fighter Sundays"];

        var get_event_name = event_name[Math.floor(Math.random() * event_name.length)];
        var description = `Tonight we'll be watching ${movies[Math.floor(Math.random() * movies.length)]} and ${anime[Math.floor(Math.random() * anime.length)]}`

        if (!guild)
            return console.log('Guild not found');

        const event_manager = new GuildScheduledEventManager(guild);

        await event_manager.create({
            name: get_event_name,
            scheduledStartTime: new Date("Sun Jun 25 2023 15:50:00"),
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
