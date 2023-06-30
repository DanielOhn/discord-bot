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
            .setRequired(true)    
        ),
    async execute(interaction) {

        //const name = interaction.options.getString("name");

        const msg = `${interaction}`;
        console.log(msg.split(":")[1]);

        // try {
        //     const content = await Content(sequelize).create({
        //         name: name
        //     });

        //     return interaction.reply(`${name} has been added.`);
        // } catch (err) {
        //     console.log("Couldn't add it to the db, shits fucked yo! ", err);
        // }
	},
};


export default addContent;