const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nightcore')
		.setDescription('Ativa ou desativa o nightcore.'),
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
		if (!interaction.client.nightCore.has(interaction.guild.id)) {
			interaction.client.nightCore.set(interaction.guild.id, 'nightcore');
			await player.filters.setTimescale({ pitch: 1.2, rate: 1.1 }, false)
				.setEqualizer([0.2, 0.2], false)
				.setTremolo({ depth: 0.3, frequency: 14 }, false)
				.apply();
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo nightcore foi ativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
		else {
			interaction.client.nightCore.delete(interaction.guild.id);
			await player.filters.setTimescale({ pitch: 1, rate: 1 }, false)
				.setEqualizer([0, 0], false)
				.setTremolo({ depth: 0, frequency: 0 }, false)
				.apply();
			const nightCore = new EmbedBuilder()
				.setDescription(`${emoji.volume} ${interaction.member} **|** O modo nightcore foi desativado.`)
				.setColor('#cd949d');
			return interaction.reply({ embeds: [nightCore] });
		}
	}
};