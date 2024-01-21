const { SlashCommandBuilder } = require('discord.js');
const { connection: db } = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra a latência do bot!'),
	async execute  (interaction) {
		const databasePing = async () => {
			const cNano = process.hrtime();
			await db.db.command({
				ping: 1,
			});
			const time = process.hrtime(cNano);
			return (time[0] * 1e9 + time[1]) * 1e-6;
		};
		await interaction.reply(`:ping_pong: Pong!\n> **API Ping:** \`${interaction.client.ws.ping}ms\`\n> **WebSocket Ping:** \`${Date.now() - interaction.createdTimestamp}ms\`\n> **Database Ping:** \`${Math.round(await databasePing())}ms\``);
	},
};