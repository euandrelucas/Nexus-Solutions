const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wikipedia')
		.setDescription('Pesquisa sobre tudo.')
		.addStringOption(option =>
			option.setName('termo')
				.setDescription('O termo que deseja pesquisar.')
				.setRequired(true)),
	async execute (interaction) {
		await interaction.deferReply();
		const word = interaction.options.getString('termo');

		try {
			const response = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`);

			if (!response.ok) {
				throw new Error(`Erro na requisição: ${response.status}`);
			}

			const wikipedia = await response.json();
			const embed = new EmbedBuilder()
				.setTitle(`${emoji.wikipedia} ` + wikipedia.title)
				.setURL(wikipedia.content_urls.desktop.page)
				.setDescription(wikipedia.extract)
				.setColor('Blue')
				.setFooter({
					text: `ID do usuário: ${interaction.user.id}`,
					iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
				});

			if (wikipedia.thumbnail) {
				embed.setThumbnail(wikipedia.thumbnail.source);
			}
			else {
				embed.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 }));
			}

			if (wikipedia.originalimage) {
				embed.setImage(wikipedia.originalimage.source);
			}

			interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			const notFound = new EmbedBuilder()
				.setDescription(`${emoji.error} ${interaction.member} **|** Não encontrei nada sobre "${word}".`)
				.setColor('Red')
				.setFooter({
					text: `ID do usuário: ${interaction.user.id}`,
					iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
				});
			interaction.editReply({
				embeds: [notFound]
			});
		}
	},
};
