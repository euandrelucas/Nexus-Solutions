const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setName('autothread')
		.setDescription('Configura o sistema de threads.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('O canal para criar as threads').addChannelOption(option =>
					option.setName('canal')
					  .setDescription('Nome do canal')
					  .setRequired(true)
						.addChannelTypes(ChannelType.GuildText)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('O canal que deixará de ter threads').addStringOption(option =>
					option.setName('canal')
					  .setDescription('Nome do canal')
					  .setRequired(true)
						.setAutocomplete(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Show server info').addStringOption(option =>
					option.setName('tipo')
					  .setDescription('Se você deseja Ativar ou Desativar')
					  .setRequired(true)
						.addChoices(
							{
								name: 'Ativar',
								value: 'on',
							},
							{
								name: 'Desativar',
								value: 'off',
							},
						))),
	async autocomplete (interaction) {
		const focusedValue = interaction.options.getFocused();
		if (focusedValue === '') {
			const obj = [{ name: 'Digite o nome do canal que deseja remover.', value: '0' }];
			return interaction.respond(
			    obj.map(choice => ({ name: `${choice.name}`, value: choice.value })),
			);
		}
		const enabledChannels = await interaction.client.db.guild.getAutoThreadChannels(interaction.guild.id);
		let channels = [];
		enabledChannels.map(async channel => {
			const ch = interaction.client.channels.cache.get(channel);
			if (!ch) {
				await interaction.client.db.guild.removeAutoThread(interaction.guild.id, channel);
			}
			return channels.push({
				name: ch.name,
				value: ch.id,
			});
		});
		const filtered = channels.filter(channel => channel.name.toLowerCase().includes(focusedValue.toLowerCase()));
		if (filtered.length === 0) {
			const obj = [{ name: 'Nenhum canal encontrado.', value: '1' }];
			return interaction.respond(
			    obj.map(choice => ({ name: `${choice.name}`, value: choice.value })),
			);
		}
		if (focusedValue) {
			return interaction.respond(
			    filtered.map(choice => ({ name: `#${choice.name} (Canal de Texto)`, value: choice.value })),
			);
		}
	},
	async execute (interaction) {
		if (interaction.options.getSubcommand() === 'adicionar') {
			const channelId = interaction.options.getChannel('canal').id;
			const channel = interaction.client.channels.cache.get(channelId);
			const enabledChannels = await interaction.client.db.guild.getAutoThreadChannels(interaction.guild.id);
			if (enabledChannels.find(ch => ch === channelId)) return interaction.reply(`${emoji.error} ${interaction.member} **|** Esse canal já está na lista.`);
			await interaction.client.db.guild.setAutoThread(interaction.guild.id, true);
			await interaction.client.db.guild.addAutoThread(interaction.guild.id, channelId);
			return interaction.reply(`${emoji.success} ${interaction.member} **|** Canal \`${channel.name}\` adicionado com sucesso.`);
		}
		if (interaction.options.getSubcommand() === 'remover') {
			const channelId = interaction.options.getString('canal');
			if (channelId === '0') return interaction.reply(`${emoji.error} ${interaction.member} **|** Digite o nome do canal que deseja remover.`);
			if (channelId === '1') return interaction.reply(`${emoji.error} ${interaction.member} **|** Nenhum canal encontrado.`);
			const channel = interaction.guild.channels.cache.find(ch => ch.id === channelId);
			if (!channel) return interaction.reply('Canal não encontrado.');
			const enabledChannels = await interaction.client.db.guild.getAutoThreadChannels(interaction.guild.id);
			if (!enabledChannels.find(ch => ch === channel.id)) return interaction.reply(`${emoji.error} ${interaction.member} **|** Esse canal não está na lista`);
			await interaction.client.db.guild.removeAutoThread(interaction.guild.id, channel.id);
			return interaction.reply(`${emoji.success} ${interaction.member} **|** Canal \`${channel.name}\` removido com sucesso.`);
		}
		if (interaction.options.getSubcommand() === 'status') {
			const status = interaction.options.getString('tipo');
			if (status === 'on') {
				await interaction.client.db.guild.setAutoThread(interaction.guild.id, true);
				return interaction.reply(`${emoji.success} ${interaction.member} **|** AutoThread ativado com sucesso.`);
			}
			if (status === 'off') {
				await interaction.client.db.guild.setAutoThread(interaction.guild.id, false);
				return interaction.reply(`${emoji.success} ${interaction.member} **|** AutoThread desativado com sucesso.`);
			}
		}
	}
};