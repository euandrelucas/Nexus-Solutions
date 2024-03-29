const { SlashCommandBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const child_process = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bots')
		.setDescription('Lista os bots que você tem hospedado!'),
	async execute (interaction) {
		const user = await interaction.client.db.user.getUser(interaction.user.id);
		if (!user) return interaction.reply({ content: 'Ocorreu um erro ao buscar suas informações!', ephemeral: true });
		const bots = user.hostBots;
		if (bots.length === 0) return interaction.reply({ content: 'Você não tem nenhum bot hospedado!', ephemeral: true });
		const select = new StringSelectMenuBuilder()
			.setCustomId(`select;${interaction.user.id};bots`)
			.setPlaceholder('Selecione o bot!')
			.addOptions(
				bots.map(bot => {
					return new StringSelectMenuOptionBuilder()
						.setLabel(bot.botID)
						.setDescription(`Linguagem: ${bot.language} - RAM: ${bot.ram} - CPU: ${bot.cpu}`)
						.setValue(bot.botID)
						.setEmoji(Object.values(interaction.client.emoji).find(emoji => emoji.includes(bot.language.toLowerCase())));
				})
			);
		const row = new ActionRowBuilder()
			.addComponents(select);
		const embed = new EmbedBuilder()
			.setTitle('Bots')
			.setDescription('Selecione o bot que deseja gerenciar!')
			.setColor('Blurple');
		const message = await interaction.reply({ embeds: [embed], components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = await message.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
		if (collector.customId === `select;${interaction.user.id};bots`) {
			const status = child_process.execSync(`docker container inspect ${collector.values[0]} --format '{{json .State}}'`).toString();
			const statusJSON = JSON.parse(status);
			const stats = child_process.execSync(`docker stats ${collector.values[0]} --no-stream --format "{{json .}}"`).toString();
			const statsJSON = JSON.parse(stats);
			const logs = child_process.execSync(`docker logs --tail 5 ${collector.values[0]}`).toString();
			const botinfo = await interaction.client.users.cache.get(collector.values[0]) ? interaction.client.users.cache.get(collector.values[0]) : await interaction.client.users.fetch(collector.values[0], {
				force: true
			});
			const started = new Date(statusJSON.StartedAt);
			const finished = new Date(statusJSON.FinishedAt);
			let status2;
			if (statusJSON.Status === 'running') {
				status2 = 'Executando';
			}
			else if (statusJSON.Status === 'created') {
				status2 = 'Criado';
			}
			else if (statusJSON.Status === 'exited') {
				status2 = 'Finalizado';
			}
			else if (statusJSON.Status === 'paused') {
				status2 = 'Pausado';
			}
			const embed = new EmbedBuilder()
				.setTitle(`Gerenciar - ${botinfo.username}`)
				.setColor('Blurple')
				.setThumbnail(botinfo.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: 'Powered by: Nexus Solutions',
					iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
				})
				.addFields(
					{
						name: '📊 Status',
						value: `**Status:** ${status2}\n**Iniciado em:** ${started.toLocaleDateString('pt-BR')}\n**Finalizado em:** ${finished.toLocaleDateString('pt-BR')}`,
						inline: true
					},
					{
						name: '💻 Uso de CPU e RAM',
						value: `**CPU:** ${statsJSON.CPUPerc}\n**RAM:** ${statsJSON.MemUsage}`,
						inline: true
					},
					{
						name: '📃 Últimas 5 linhas de logs',
						value: `\`\`\`${logs}\`\`\``
					}
				);
			const stopButton = new ButtonBuilder()
				.setCustomId(`stop;${interaction.user.id};${collector.values[0]}`)
				.setLabel('Parar')
				.setEmoji('⏹️')
				.setDisabled(statusJSON.Status === 'running' ? false : true)
				.setStyle('Danger');
			const restartButton = new ButtonBuilder()
				.setCustomId(`restart;${interaction.user.id};${collector.values[0]}`)
				.setLabel('Reiniciar')
				.setEmoji('🔄')
				.setDisabled(statusJSON.Status === 'running' ? false : true)
				.setStyle('Primary');
			const logsButton = new ButtonBuilder()
				.setCustomId(`logs;${interaction.user.id};${collector.values[0]}`)
				.setLabel('Logs')
				.setEmoji('📃')
				.setDisabled(statusJSON.Status === 'running' ? false : true)
				.setStyle('Secondary');
			const startButton = new ButtonBuilder()
				.setCustomId(`start;${interaction.user.id};${collector.values[0]}`)
				.setLabel('Iniciar')
				.setEmoji('▶️')
				.setDisabled(statusJSON.Status === 'running' ? true : false)
				.setStyle('Success');
			const reloadButton = new ButtonBuilder()
				.setCustomId(`reload;${interaction.user.id};${collector.values[0]}`)
				.setEmoji('🔄')
				.setStyle('Secondary');
			const row = new ActionRowBuilder()
				.addComponents(stopButton, restartButton, logsButton, startButton, reloadButton);
			const deleteButton = new ButtonBuilder()
				.setCustomId(`delete;${interaction.user.id};${collector.values[0]}`)
				.setLabel('Deletar bot')
				.setEmoji('🗑️')
				.setStyle('Danger');
			const row2 = new ActionRowBuilder()
				.addComponents(deleteButton);
			await collector.update({ embeds: [embed], components: [row, row2] });
		}
	},
};