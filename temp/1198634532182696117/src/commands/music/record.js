const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('record')
		.setDescription('Inicia ou encerra a gravação de voz'),
	async execute (interaction) {
		if (!interaction.client.records.has(interaction.guild.id)) {
			if (!interaction.member.voice.channel) {
				return interaction.reply('Você precisa estar em um canal de voz para usar este comando.');
			}

			const player = interaction.client.vulkava.createPlayer({
				guildId: interaction.guild.id,
				textChannelId: interaction.channel.id,
				voiceChannelId: interaction.member.voice.channelId
			});

			player.connect();

			await player.recorder.start({
				id: interaction.channel.id,
				bitrate: interaction.member.voice.channel.bitrate,
				selfAudio: true
			});

			const recording = new EmbedBuilder()
				.setDescription(':red_circle: **|** Iniciando a gravação de voz!')
				.setColor('#cd949d');
			await interaction.reply({ embeds: [recording] });

			interaction.client.records.set(interaction.guild.id, interaction.channel.id);
		}
		else {
			const player = interaction.client.vulkava.players.get(interaction.guild.id);
			await player.recorder.stop();
			// await player.destroy();
			const recording = new EmbedBuilder()
				.setDescription(':white_circle: **|** Parando a gravação de voz!')
				.setColor('#cd949d');
			await interaction.reply({ embeds: [recording] });
		}
	}
};
