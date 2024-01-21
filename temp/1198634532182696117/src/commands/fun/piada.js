const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const piadas = require('../../modules/jokes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('piada')
		.setDescription('Conta várias piadas.'),
	async execute (interaction) {
		await interaction.deferReply();
		const rand = Math.floor(Math.random() * piadas.features.length);
		const piada = piadas.features[rand];
		const embed = new EmbedBuilder()
			.setTitle(`${emoji.piada} Piada`)
			.setDescription(piada.properties.pergunta)
			.addFields(
				{
					name: 'Resposta',
					value: `||${piada.properties.resposta}||`,
					inline: false
				}
			)
			.setFooter({
				text: `ID do usuário: ${interaction.user.id}`,
				iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('#cd949d');
		await interaction.editReply({ embeds: [embed] });
	},
};