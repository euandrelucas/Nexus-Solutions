const { SlashCommandBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configura o bot')
		.addSubcommand(subcommand =>
			subcommand.setName('manutation')
				.setDescription('Configura a manutenção do bot')
				.addStringOption(option =>
					option.setName('enabled')
						.setDescription('Se a manutenção está ativada')
						.setRequired(true)
						.addChoices(
							{
								name: 'Sim',
								value: 'true'
							},
							{
								name: 'Não',
								value: 'false'
							}

						))
				.addStringOption(option =>
					option.setName('reason')
						.setDescription('O motivo da manutenção')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('version-logs')
				.setDescription('Configura os logs de versão')
				// Número da versão é obtido pelo package.json
				.addStringOption(option =>
					option.setName('logs')
						.setDescription('Os logs')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('enabled')
						.setDescription('Se os logs estão ativados')
						.setRequired(true)
						.addChoices(
							{
								name: 'Sim',
								value: 'true'
							},
							{
								name: 'Não',
								value: 'false'
							}
						)))
		.addSubcommand(subcommand =>
			subcommand.setName('blacklist')
				.setDescription('Configura a blacklist do bot')
				.addStringOption(option =>
					option.setName('enabled')
						.setDescription('Se a blacklist está ativada')
						.setRequired(true)
						.addChoices(
							{
								name: 'Sim',
								value: 'true'
							},
							{
								name: 'Não',
								value: 'false'
							}
						))
				.addStringOption(option =>
					option.setName('type')
						.setDescription('O tipo de blacklist')
						.setRequired(true)
						.addChoices(
							{
								name: 'Usuário',
								value: 'user'
							},
							{
								name: 'Servidor',
								value: 'guild'
							}
						))),
	async execute  (interaction) {
		const dev = ['742798447253651506', '717766639260532826'];
		if (!dev.includes(interaction.user.id)) return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Esse comando só pode ser executado por Desenvolvedores.` });
		if (interaction.options.getSubcommand() === 'manutation') {
			const enabled = interaction.options.getString('enabled');
			const reason = interaction.options.getString('reason');
			const boolean = enabled === 'true' ? true : false;
			await interaction.client.db.bot.editManutation(boolean, reason, interaction.user.id);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** Manutenção ${enabled === 'true' ? 'ativada' : 'desativada'} com sucesso.` });
		}
		if (interaction.options.getSubcommand() === 'version-logs') {
			const logs = interaction.options.getString('logs');
			const enabled = interaction.options.getString('enabled');
			await interaction.client.db.bot.editVersionLogs(require('../../../package.json').version, logs, enabled);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** Logs de versão ${enabled === 'true' ? 'ativados' : 'desativados'} com sucesso.` });
		}
		if (interaction.options.getSubcommand() === 'blacklist') {
			const enabled = interaction.options.getString('enabled');
			const type = interaction.options.getString('type');
			if (type === 'user') {
				await interaction.client.db.bot.editBlacklist(enabled);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** Blacklist de usuários ${enabled === 'true' ? 'ativada' : 'desativada'} com sucesso.` });
			}
			if (type === 'guild') {
				await interaction.client.db.bot.editBlacklist(enabled);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** Blacklist de servidores ${enabled === 'true' ? 'ativada' : 'desativada'} com sucesso.` });
			}
		}
	}
};