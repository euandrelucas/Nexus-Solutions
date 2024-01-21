const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eightd')
		.setDescription('Ativa ou desativa o 8D.'),
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
		if (!interaction.client.eightD.has(interaction.guild.id)) {
			interaction.client.eightD.set(interaction.guild.id, 'eightD');
			await player.filters.setRotation({ rotationHz: 0.2 });
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo 8D foi ativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
		else {
			interaction.client.eightD.delete(interaction.guild.id);
			await player.filters.setRotation({ rotationHz: 0 });
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo 8D foi desativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
	}
};