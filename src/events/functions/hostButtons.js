const { AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const child_process = require('child_process');
const config = require('../../config');

module.exports = async (interaction) => {
	if (interaction.customId.startsWith('logs')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		const botId = interaction.customId.split(';')[2];
		const logs = await child_process.execSync(`docker logs ${botId}`).toString();
		const attachment = new AttachmentBuilder(Buffer.from(logs), {
			name: `${botId}.txt`
		});
		const user = await interaction.client.users.cache.get(userId) ? await interaction.client.users.cache.get(userId) : await interaction.client.users.fetch(userId, {
			force: true
		});
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Logs - ${bot.username}`)
			.setDescription(`Logs do bot ${botId}`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed], files: [attachment] }).catch(() => {
			return interaction.editReply({ embeds: [embed], files: [attachment], ephemeral: true });
		});
		await interaction.editReply({ content: 'Logs enviados com sucesso!', ephemeral: true });
		const logsc = await interaction.client.channels.cache.get(config.logs.host);
		logsc.send({
			content: `${interaction.client.emoji.success} | Os logs do bot \`${bot.username.replace(/`/g, '')}\` foram enviados para o usuário \`${user.tag}\`!`
		});
	}
	if (interaction.customId.startsWith('stop')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		const botId = interaction.customId.split(';')[2];
		await child_process.execSync(`docker stop ${botId}`).toString();
		const user = await interaction.client.users.cache.get(userId) ? await interaction.client.users.cache.get(userId) : await interaction.client.users.fetch(userId, {
			force: true
		});
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Parar - ${bot.username}`)
			.setDescription(`O bot ${botId} foi parado com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed] }).catch(() => {
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		});
		await interaction.editReply({ content: 'Bot parado com sucesso!', ephemeral: true });
		const logsc = await interaction.client.channels.cache.get(config.logs.host);
		logsc.send({
			content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi parado pelo usuário \`${user.tag}\`!`
		});
	}
	if (interaction.customId.startsWith('restart')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		const botId = interaction.customId.split(';')[2];
		await child_process.execSync(`docker restart ${botId}`).toString();
		const user = await interaction.client.users.cache.get(userId) ? await interaction.client.users.cache.get(userId) : await interaction.client.users.fetch(userId, {
			force: true
		});
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Reiniciar - ${bot.username}`)
			.setDescription(`O bot ${botId} foi reiniciado com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed] }).catch(() => {
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		});
		await interaction.editReply({ content: 'Bot reiniciado com sucesso!', ephemeral: true });
		const logsc = await interaction.client.channels.cache.get(config.logs.host);
		logsc.send({
			content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi reiniciado pelo usuário \`${user.tag}\`!`
		});
	}
	if (interaction.customId.startsWith('start')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		const botId = interaction.customId.split(';')[2];
		await child_process.execSync(`docker start ${botId}`).toString();
		const user = await interaction.client.users.cache.get(userId) ? await interaction.client.users.cache.get(userId) : await interaction.client.users.fetch(userId, {
			force: true
		});
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Iniciar - ${bot.username}`)
			.setDescription(`O bot ${botId} foi iniciado com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed] }).catch(() => {
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		});
		await interaction.editReply({ content: 'Bot iniciado com sucesso!', ephemeral: true });
		const logsc = await interaction.client.channels.cache.get(config.logs.host);
		logsc.send({
			content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi iniciado pelo usuário \`${user.tag}\`!`
		});
	}
	if (interaction.customId.startsWith('delete')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (interaction.user.id !== userId) return interaction.editReply({ content: 'Você não pode excluir o bot de outra pessoa!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		// Faça um backup do container e envie em formato de zip para o usuário, exclua a pasta node_modules do backup.
		await child_process.execSync(`docker commit ${botId} ${botId}-backup`).toString();
		await child_process.execSync(`docker export ${botId} > ${botId}-backup.tar`).toString();
		await child_process.execSync(`tar -czvf ${botId}-backup.tar.gz ${botId}-backup.tar`).toString();
		const attachment = new AttachmentBuilder(Buffer.from(`${botId}-backup.tar.gz`), {
			name: `${botId}-backup.tar.gz`
		});
		const user = await interaction.client.users.cache.get(userId) ? await interaction.client.users.cache.get(userId) : await interaction.client.users.fetch(userId, {
			force: true
		});
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed2 = new EmbedBuilder()
			.setTitle(`Excluir - ${bot.username}`)
			.setDescription(`O bot ${botId} foi excluído com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed2], files: [attachment] }).catch(() => {
			return interaction.editReply({ embeds: [embed], files: [attachment], ephemeral: true });
		});
		await child_process.execSync(`docker stop ${botId}`).toString();
		await child_process.execSync(`docker rm ${botId}`).toString();
		await child_process.execSync(`docker rmi ${botId}`).toString();
		const embed = new EmbedBuilder()
			.setTitle(`Excluir - ${bot.username}`)
			.setDescription(`O bot ${botId} foi excluído com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		await user.send({ embeds: [embed] }).catch(() => {
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		});
		await interaction.client.db.hbots.deleteBot(interaction.user.id, bot.id);
		const user2 = await interaction.client.db.user.checkUser(interaction.user.id);
		if (!user2) return;
		await interaction.client.db.user.removeBot(interaction.user.id, bot.id);
		await interaction.editReply({ content: 'Bot excluído com sucesso!', ephemeral: true });
		const logsc = await interaction.client.channels.cache.get(config.logs.host);
		logsc.send({
			content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi excluído pelo usuário \`${user.tag}\`!`
		});
	}
	if (interaction.customId.startsWith('reload')) {
		const status = child_process.execSync(`docker container inspect ${interaction.customId.split(';')[2]} --format '{{json .State}}'`).toString();
		const statusJSON = JSON.parse(status);
		const stats = child_process.execSync(`docker stats ${interaction.customId.split(';')[2]} --no-stream --format "{{json .}}"`).toString();
		const statsJSON = JSON.parse(stats);
		const logs = child_process.execSync(`docker logs --tail 5 ${interaction.customId.split(';')[2]}`).toString();
		const botinfo = await interaction.client.users.cache.get(interaction.customId.split(';')[2]) ? interaction.client.users.cache.get(interaction.customId.split(';')[2]) : await interaction.client.users.fetch(interaction.customId.split(';')[2], {
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
			.setCustomId(`stop;${interaction.user.id};${interaction.customId.split(';')[2]}`)
			.setLabel('Parar')
			.setEmoji('⏹️')
			.setDisabled(statusJSON.Status === 'running' ? false : true)
			.setStyle('Danger');
		const restartButton = new ButtonBuilder()
			.setCustomId(`restart;${interaction.user.id};${interaction.customId.split(';')[2]}`)
			.setLabel('Reiniciar')
			.setEmoji('🔄')
			.setDisabled(statusJSON.Status === 'running' ? false : true)
			.setStyle('Primary');
		const logsButton = new ButtonBuilder()
			.setCustomId(`logs;${interaction.user.id};${interaction.customId.split(';')[2]}`)
			.setLabel('Logs')
			.setEmoji('📃')
			.setDisabled(statusJSON.Status === 'running' ? false : true)
			.setStyle('Secondary');
		const startButton = new ButtonBuilder()
			.setCustomId(`start;${interaction.user.id};${interaction.customId.split(';')[2]}`)
			.setLabel('Iniciar')
			.setEmoji('▶️')
			.setDisabled(statusJSON.Status === 'running' ? true : false)
			.setStyle('Success');
		const reloadButton = new ButtonBuilder()
			.setCustomId(`reload;${interaction.user.id};${interaction.customId.split(';')[2]}`)
			.setEmoji('🔄')
			.setDisabled(statusJSON.Status === 'running' ? true : false)
			.setStyle('Secondary');
		const row = new ActionRowBuilder()
			.addComponents(stopButton, restartButton, logsButton, startButton, reloadButton);
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
};