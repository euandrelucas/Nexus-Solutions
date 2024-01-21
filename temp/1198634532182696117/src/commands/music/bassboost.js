const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bassboost')
		.setDescription('Ativa ou desativa o bassboost.'),
	async execute (interaction) {
		const joinChannel = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** Você precisa entrar em um canal de voz para executar os comandos de música.`)
			.setColor('#cd949d');
		if (!interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [joinChannel]
			});
		};
		const player = interaction.client.vulkava.players.get(interaction.guild.id);
		if (!player) {
			const noMusic = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** Não há música tocando no momento.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [noMusic] });
		}
		if (!interaction.client.bassboost.has(interaction.guild.id)) {
			interaction.client.bassboost.set(interaction.guild.id, 'bassboost');
			await player.filters.setEqualizer([0.29, 0.23, 0.19, 0.16, 0.08]);

			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo bassboost foi ativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
		else {
			interaction.client.bassboost.delete(interaction.guild.id);
			await player.filters.setEqualizer([0, 0, 0, 0, 0]);
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo bassboost foi desativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
	}
};