const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('karaoke')
		.setDescription('Ativa ou desativa o karaoke.'),
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
		if (!interaction.client.karaoke.has(interaction.guild.id)) {
			interaction.client.karaoke.set(interaction.guild.id, 'karaoke');
			await player.filters.setKaraoke({
				apply: true,
			});
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo karaoke foi ativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
		else {
			interaction.client.karaoke.delete(interaction.guild.id);
			await player.filters.setKaraoke(null);
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo karaoke foi desativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
	}
};