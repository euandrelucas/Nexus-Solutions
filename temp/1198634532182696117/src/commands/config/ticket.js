const { SlashCommandBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const emoji = require('../../modules/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setName('ticket')
		.setDescription('Configure o sistema de tickets.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('canal')
				.setDescription('O canal responsável pelas threads').addChannelOption(option =>
					option.setName('canal')
						.setDescription('Nome do canal')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('categoria')
				.setDescription('A categoria responsável pelas threads').addChannelOption(option =>
					option.setName('categoria')
						.setDescription('Nome da categoria')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildCategory)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Ativa ou desativa o sistema de tickets').addStringOption(option =>
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
						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('logs')
				.setDescription('O canal para enviar os logs').addChannelOption(option =>
					option.setName('canal')
						.setDescription('Nome do canal')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('autotranscript')
				.setDescription('Ativa ou desativa o sistema de transcript automático').addStringOption(option =>
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
						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('transcript')
				.setDescription('O canal para enviar os transcripts').addChannelOption(option =>
					option.setName('canal')
						.setDescription('Nome do canal')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('embed')
				.setDescription('Configura a embed da mensagem')
				.addStringOption(option =>
					option.setName('titulo')
						.setDescription('O título da embed')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('descricao')
						.setDescription('A descrição da embed')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('cor')
						.setDescription('A cor da embed')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('imagem')
						.setDescription('A imagem da embed')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('rodape')
						.setDescription('O rodapé da embed')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('thumbnail')
						.setDescription('A thumbnail da embed')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('enviar')
				.setDescription('Envia a mensagem de tickets'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('suporte')
				.setDescription('Seta os cargos de suporte')
				.addRoleOption(option =>
					option.setName('cargo')
						.setDescription('O cargo de suporte')
						.setRequired(true))),
	async execute (interaction) {
		if (interaction.options.getSubcommand() === 'canal') {
			const channel = interaction.options.getChannel('canal');
			if (channel.type !== ChannelType.GuildText) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** O canal precisa ser de texto.`, ephemeral: true });
			}
			await interaction.client.db.guild.setTicketsChannel(interaction.guild.id, channel.id);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O canal de tickets foi definido para <#${channel.id}>.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'categoria') {
			const category = interaction.options.getChannel('categoria');
			if (category.type !== ChannelType.GuildCategory) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** A categoria precisa ser uma categoria.`, ephemeral: true });
			}
			await interaction.client.db.guild.setTicketsCategory(interaction.guild.id, category.id);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** A categoria de tickets foi definida para <#${category.id}>.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'status') {
			const type = interaction.options.getString('tipo');
			if (type === 'on') {
				await interaction.client.db.guild.setTickets(interaction.guild.id, true);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O sistema de tickets foi ativado.`, ephemeral: true });
			}
			if (type === 'off') {
				await interaction.client.db.guild.setTickets(interaction.guild.id, false);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O sistema de tickets foi desativado.`, ephemeral: true });
			}
			return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Você precisa escolher entre \`Ativado\` ou \`Desativado\`.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'logs') {
			const channel = interaction.options.getChannel('canal');
			if (channel.type !== ChannelType.GuildText) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** O canal precisa ser de texto.`, ephemeral: true });
			}
			await interaction.client.db.guild.setTicketsLogs(interaction.guild.id, channel.id);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O canal de logs foi definido para <#${channel.id}>.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'autotranscript') {
			const type = interaction.options.getString('tipo');
			if (type === 'on') {
				await interaction.client.db.guild.setTicketsTranscript(interaction.guild.id, true);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O sistema de transcript automático foi ativado.`, ephemeral: true });
			}
			if (type === 'off') {
				await interaction.client.db.guild.setTicketsTranscript(interaction.guild.id, false);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O sistema de transcript automático foi desativado.`, ephemeral: true });
			}
			return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Você precisa escolher entre \`Ativado\` ou \`Desativado\`.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'transcript') {
			const channel = interaction.options.getChannel('canal');
			if (channel.type !== ChannelType.GuildText) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** O canal precisa ser de texto.`, ephemeral: true });
			}
			await interaction.client.db.guild.setTicketsTranscript(interaction.guild.id, channel.id);
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O canal de transcript foi definido para <#${channel.id}>.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'embed') {
			const titulo = interaction.options.getString('titulo');
			const descricao = interaction.options.getString('descricao');
			const cor = interaction.options.getString('cor') || 'Blurple';
			const imagem = interaction.options.getString('imagem') || null;
			const rodape = interaction.options.getString('rodape') || null;
			const thumbnail = interaction.options.getString('thumbnail') || null;
			await interaction.client.db.guild.setTicketsEmbed(interaction.guild.id, titulo, descricao, cor, rodape, thumbnail, imagem);
			const exampleEmbed = new EmbedBuilder()
				.setTitle(titulo)
				.setDescription(descricao)
				.setColor(cor);
			if (imagem) {
				exampleEmbed.setImage(imagem);
			}
			if (thumbnail) {
				exampleEmbed.setThumbnail(thumbnail);
			}
			if (rodape) {
				exampleEmbed.setFooter({
					text: rodape,
				});
			}
			await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
			return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** A embed foi definida.\nCONFIRA:`, embeds: [exampleEmbed], ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'enviar') {
			const channel = await interaction.client.db.guild.getTicketsChannel(interaction.guild.id);
			const textChannel = interaction.guild.channels.cache.get(channel);
			const category = await interaction.client.db.guild.getTicketsCategory(interaction.guild.id);
			const embedData = await interaction.client.db.guild.getTicketsEmbed(interaction.guild.id);
			const status = await interaction.client.db.guild.getTickets(interaction.guild.id);
			if (!channel) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** O canal de tickets não foi definido.`, ephemeral: true });
			}
			if (!category) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** A categoria de tickets não foi definida.`, ephemeral: true });
			}
			if (embedData.title === null || embedData.description === null) {
				return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** A embed de tickets não foi definida.`, ephemeral: true });
			}
			if (!status) {
				await interaction.client.db.guild.setTickets(interaction.guild.id, true);
			}
			const embed = new EmbedBuilder();
			embed.setTitle(embedData.title);
			embed.setDescription(embedData.description);
			embed.setColor(embedData.color);
			if (embedData.image) {
				embed.setImage(embedData.image);
			}
			if (embedData.thumbnail) {
				embed.setThumbnail(embedData.thumbnail);
			}
			if (embedData.footer) {
				embed.setFooter({
					text: embedData.footer,
				});
			}
			const button = new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Abrir Ticket')
				.setEmoji(emoji.mail.replace('<', '').replace('>', ''))
				.setCustomId(`openTicket;${interaction.guild.id}`);
			const actionRow = new ActionRowBuilder().addComponents(button);
			await textChannel.send({ embeds: [embed], components: [actionRow] });
			await interaction.reply({ content: `${emoji.success} ${interaction.member} **|** A mensagem foi enviada!`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'suporte') {
			const role = interaction.options.getRole('cargo');
			const supportRole = await interaction.client.db.guild.getTicketsSupportRole(interaction.guild.id);
			if (supportRole.includes(role.id)) {
				await interaction.client.db.guild.removeTicketsSupportRole(interaction.guild.id, role.id);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O cargo de suporte foi removido <@&${role.id}>.`, ephemeral: true });
			}
			else {
				await interaction.client.db.guild.setTicketsSupportRole(interaction.guild.id, role.id);
				return interaction.reply({ content: `${emoji.success} ${interaction.member} **|** O cargo de suporte foi adicionado <@&${role.id}>.`, ephemeral: true });
			}
		}
	}
};