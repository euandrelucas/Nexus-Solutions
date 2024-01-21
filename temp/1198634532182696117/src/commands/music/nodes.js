const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nodes')
		.setDescription('Comando para ver os status dos nodes.'),
	async execute (interaction) {
		const nodes = interaction.client.vulkava.nodes;
		const fields = nodes.map(node => {
			const usedMemory = node.stats.memory.used / 1024 / 1024;
			const reservableMemory = node.stats.memory.reservable / 1024 / 1024;
			return {
				name: node.options.id,
				value: `**${node.stats.players}** players\n**${node.stats.playingPlayers}** players tocando\n**${node.stats.cpu.lavalinkLoad.toFixed(2)}**% CPU\n**${usedMemory.toFixed(2)}** MB/${reservableMemory.toFixed(2)} MB`,
				inline: true
			};
		});
		const embed = new EmbedBuilder()
			.setTitle('Nodes')
			.addFields(fields)
			.setColor('#cd949d');
		await interaction.reply({ embeds: [embed] });
	}
};