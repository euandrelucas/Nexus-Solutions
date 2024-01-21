const { AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const child_process = require('child_process');

module.exports = async (interaction) => {
	if (interaction.customId.startsWith('logs')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode ver os logs de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const logs = child_process.execSync(`docker logs ${botId}`).toString();
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
	}
	if (interaction.customId.startsWith('stop')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode parar o bot de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Parar - ${bot.username}`)
			.setDescription(`Você realmente deseja parar o bot ${bot.username}?`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		const bt = new ButtonBuilder()
			.setStyle('Danger')
			.setLabel('Parar')
			.setCustomId(`confirmStop;${userId};${botId}`);
		const bt2 = new ButtonBuilder()
			.setStyle('Primary')
			.setLabel('Cancelar')
			.setCustomId('cancelStop');
		const row = new ActionRowBuilder()
			.addComponents(bt, bt2);
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
	if (interaction.customId.startsWith('confirmStop')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode parar o bot de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Parar - ${bot.username}`)
			.setDescription(`O bot ${bot.username} foi parado com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		const bt = new ButtonBuilder()
			.setStyle('Primary')
			.setLabel('Reiniciar')
			.setCustomId(`restart;${userId};${botId}`);
		const row = new ActionRowBuilder()
			.addComponents(bt);
		await interaction.editReply({ embeds: [embed], components: [row] });
		child_process.execSync(`docker stop ${botId}`);
	}
	if (interaction.customId.startsWith('restart')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode reiniciar o bot de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Reiniciar - ${bot.username}`)
			.setDescription(`Você realmente deseja reiniciar o bot ${bot.username}?`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		const bt = new ButtonBuilder()
			.setStyle('Danger')
			.setLabel('Reiniciar')
			.setCustomId(`confirmRestart;${userId};${botId}`);
		const bt2 = new ButtonBuilder()
			.setStyle('Primary')
			.setLabel('Cancelar')
			.setCustomId('cancelRestart');
		const row = new ActionRowBuilder()
			.addComponents(bt, bt2);
		await interaction.editReply({ embeds: [embed], components: [row] });
	}
	if (interaction.customId.startsWith('confirmRestart')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode reiniciar o bot de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`Reiniciar - ${bot.username}`)
			.setDescription(`O bot ${bot.username} foi reiniciado com sucesso!`)
			.setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: 'Powered by: Nexus Solutions',
				iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blurple');
		const bt = new ButtonBuilder()
			.setStyle('Danger')
			.setLabel('Parar')
			.setCustomId(`stop;${userId};${botId}`);
		const row = new ActionRowBuilder()
			.addComponents(bt);
		await interaction.editReply({ embeds: [embed], components: [row] });
		child_process.execSync(`docker restart ${botId}`);
	}
	if (interaction.customId === 'cancelStop') {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode parar o bot de outro usuário!', ephemeral: true });
		const botId = interaction.customId.split(';')[2];
		const bt = new ButtonBuilder()
			.setStyle('Danger')
			.setLabel('Parar')
			.setCustomId(`stop;${userId};${botId}`);
		const bt2 = new ButtonBuilder()
			.setStyle('Primary')
			.setLabel('Reiniciar')
			.setCustomId(`restart;${userId};${botId}`);
		const bt3 = new ButtonBuilder()
			.setStyle('Primary')
			.setLabel('Logs')
			.setCustomId(`logs;${userId};${botId}`);
		const row = new ActionRowBuilder()
			.addComponents(bt, bt2, bt3);
		await interaction.editReply({ components: [row] });
	}
    if (interaction.customId === 'cancelRestart') {
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.customId.split(';')[1];
        if (userId !== interaction.user.id) return interaction.editReply({ content: 'Você não pode reiniciar o bot de outro usuário!', ephemeral: true });
        const botId = interaction.customId.split(';')[2];
        const bot = await interaction.client.users.cache.get(botId) ? await interaction.client.users.cache.get(botId) : await interaction.client.users.fetch(botId, {
            force: true
        });
        const bt = new ButtonBuilder()
            .setStyle('Danger')
            .setLabel('Parar')
            .setCustomId(`stop;${userId};${botId}`);
        const bt2 = new ButtonBuilder()
            .setStyle('Primary')
            .setLabel('Reiniciar')
            .setCustomId(`restart;${userId};${botId}`);
        const bt3 = new ButtonBuilder()
            .setStyle('Primary')
            .setLabel('Logs')
            .setCustomId(`logs;${userId};${botId}`);
        const row = new ActionRowBuilder()
            .addComponents(bt, bt2, bt3);
        await interaction.editReply({ components: [row] });
};