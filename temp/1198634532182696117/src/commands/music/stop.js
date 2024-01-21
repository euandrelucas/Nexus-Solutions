const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Para de tocar'),
	async execute (interaction) {
		const joinChannel = new EmbedBuilder()
			.setDescription(`🔊 ${interaction.member} **|** Você precisa entrar em um canal de voz para executar os comandos de música.`)
			.setColor('#cd949d');
		if (!interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [joinChannel]
			});
		}
		const player = interaction.client.vulkava.players.get(interaction.guild.id);
		if (!player) {
			const noMusic = new EmbedBuilder()
				.setDescription(`🔊 ${interaction.member} **|** Não há música tocando no momento.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [noMusic] });
		}
		const stop = new EmbedBuilder()
			.setDescription(`⏹️ ${interaction.member} **|** A música atual foi parada.`)
			.setColor('#cd949d');
		if (!player) return interaction.reply({ embeds: [stop] });
		player.destroy();
		await interaction.client.db.lavalink.checkPlayer(player.guildId);
		await interaction.client.db.lavalink.updatePlayer(player.guildId, player.voiceChannelId, player.textChannelId, player.selfDeaf, []);
		await interaction.reply({ embeds: [stop] });
	}
};