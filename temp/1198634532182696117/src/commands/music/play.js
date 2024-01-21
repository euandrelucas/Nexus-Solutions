const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const config = require('../../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Toca uma música!')
		.addStringOption(option =>
			option.setName('musica')
				.setDescription('O nome da música que deseja tocar')
				.setRequired(true)),
	async execute (interaction) {
		const joinChannel = new EmbedBuilder()
			.setDescription(`${emoji.volume} ${interaction.member} **|** Você precisa entrar em um canal de voz para executar os comandos de música.`)
			.setColor('#cd949d');
		if (!interaction.member.voice.channel) {
			return interaction.reply({
				embeds: [joinChannel]
			});
		};
		const query = interaction.options.getString('musica');
		const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		if (youtubeRegex.test(query) && !config.dev.includes(interaction.user.id)) {
			const youtubeEmbed = new EmbedBuilder()
				.setDescription(`${emoji.error} ${interaction.member} **|** Você não pode tocar músicas do YouTube.`)
				.setColor('#cd949d');
			return interaction.reply({
				embeds: [youtubeEmbed],
			});
		}
		const res = await interaction.client.vulkava.search(query);

		if (res.loadType === 'LOAD_FAILED') {
			const loadFailed = new EmbedBuilder()
				.setDescription(`${emoji.error} ${interaction.member} **|** Ocorreu um erro ao carregar a música.`)
				.setColor('#cd949d');
			return interaction.reply({
				embeds: [loadFailed],
			});
		}
		else if (res.loadType === 'NO_MATCHES') {
			const noMatches = new EmbedBuilder()
				.setDescription(`${emoji.error} ${interaction.member} **|** Nenhuma música foi encontrada.`)
				.setColor('#cd949d');
			return interaction.reply({
				embeds: [noMatches],
			});
		}

		const player = interaction.client.vulkava.createPlayer({
			guildId: interaction.guild.id,
			voiceChannelId: interaction.member.voice.channelId,
			textChannelId: interaction.channel.id,
			selfDeaf: true
		});

		player.connect();

		if (res.loadType === 'PLAYLIST_LOADED') {
			for (const track of res.tracks) {
				track.setRequester(interaction.user);
				player.queue.add(track);
			}
			const playlist = new EmbedBuilder()
				.setDescription(`${emoji.success} ${interaction.member} **|** A playlist: \`${res.playlistInfo.name.replace(/`/g, '')}\` foi adicionada a fila com sucesso com: \`${res.tracks.length}\` músicas.`)
				.setColor('#cd949d');
			await interaction.reply({
				embeds: [playlist],
			});
		}
		else {
			const track = res.tracks[0];
			track.setRequester(interaction.user);
			player.queue.add(track);
			const queued = new EmbedBuilder()
				.setDescription(`${emoji.success} ${interaction.member} **|** A música: \`${track.title.replace(/`/g, '')}\` foi adicionada a fila com sucesso.`)
				.setColor('#cd949d');
			await interaction.reply({
				embeds: [queued],
			});
		}
		if (!player.playing) player.play();
	}
};