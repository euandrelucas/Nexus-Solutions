const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Execute códigos em JavaScript')
		.addStringOption(option =>
			option.setName('code')
				.setDescription('Código a ser executado')
				.setRequired(true)),
	async execute (interaction) {
		const dev = ['742798447253651506', '717766639260532826'];

		if (!dev.includes(interaction.user.id)) {
			return interaction.reply({ content: 'Esse comando só pode ser executado por Desenvolvedores.' });
		}

		const code = interaction.options.getString('code');
		let result, type;

		try {
			result = await eval(code);
			type = typeof result;

			if (typeof result !== 'string') {
				result = require('util').inspect(result, { depth: 0 });
			}
		}
		catch (e) {
			result = e.toString();
			type = 'error';
		}

		const embed = new EmbedBuilder()
			.setDescription(`\`\`\`js\n${result.slice(0, 1010)}\`\`\``)
			.setColor('#cd949d')
			.setFooter({ text: `Tipo: ${type}` })
			.setAuthor({ name: `Executado por ${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
