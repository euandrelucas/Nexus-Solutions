const { SlashCommandBuilder } = require('discord.js');
const { generate } = require('../../modules/discordTranscript');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcript')
		.setDescription('Testando o sistema!'),
	async execute  (interaction) {
		await interaction.deferReply();
		const transcript = await generate(interaction.channel);
		await interaction.editReply({
			files: [transcript],
		});
	},
};