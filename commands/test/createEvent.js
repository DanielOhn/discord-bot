import { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } from 'discord.js';
import sequelize from '../../database.js';
import Channels from '../../models/Channels.js';
import Content from '../../models/Content.js';

const createEvent = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Creates a  scheduled event!')
        .addStringOption(option =>
            option.setName("event-name")
                .setDescription("set the name")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("date")
                .setDescription("Set the date for the event, Format: MM/DD/YYYY")
        )
        .addStringOption(option =>
            option.setName("time")
                .setDescription("Set the time , format: HH:MM")
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Describe the event")
        ),
    async execute(interaction) {
        const guild = interaction.client.guilds.cache.get(interaction.guildId);
        const getChannelDefault = await Channels(sequelize).findOne({ where: { guild_id: `${interaction.guildId}` } });

        if (getChannelDefault === null)
            return interaction.reply("No channel default")

        const channel_id = getChannelDefault.dataValues.channel_id

        let userInput = interaction.options.data;
        let event_name = "Super Cool Event";
        let date = new Date();
        let time = `${date.getHours() + 1}:00`;
        let description = "";

        for (let i in userInput) {
            if (userInput[i].name === "event-name")
                event_name = userInput[i].value

            if (userInput[i].name === "date")
                date = new Date(userInput[i].value)

            if (userInput[i].name === "time")
                time = userInput[i].value

            if (userInput[i].name === "description")
                description = userInput[i].value
        }

        let get_content;

        if (event_name === "Anime Night") {
            const getMovies = await Content(sequelize).findAll({ where: { media: "Movie" } })
            const getShows = await Content(sequelize).findAll({ where: { media: "Show" } })

            const nextFridayDate = new Date(new Date().getTime())

            nextFridayDate.setDate(
                new Date(
                    nextFridayDate.getDate() + ((7 - nextFridayDate.getDay() + 5) % 7 || 7)
                ))

            date = nextFridayDate;

            get_content = [
                getMovies[Math.floor(Math.random() * getMovies.length)].dataValues.name,
                getShows[Math.floor(Math.random() * getShows.length)].dataValues.name
            ]

            time = "18:30"
            description = `Tonight we'll be watching: \n${get_content[0]} \n${get_content[1]}`
        }


        // ADD A CUSTOM GUILD; MAKE A DB TABLE TO STORE THE GUILD ID TO THE DB TO DISCORD SERVER
        if (!guild)
            return console.log('discord server not found');

        const event_manager = new GuildScheduledEventManager(guild);


        // Sets the custom time for the event 
        time = time.split(":")

        date.setHours(time[0])
        date.setMinutes(time[1])
        date.setSeconds("00")
        date = date.toLocaleString('en-US', { timeZone: 'US/Arizona' })

        await event_manager.create({
            name: event_name,
            scheduledStartTime: date,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
            description: description,
            channel: channel_id,
            image: null,
            reason: 'Testing with creating a Scheduled Event',
        });

        await interaction.reply("Event Created!");
    }
};

export default createEvent;