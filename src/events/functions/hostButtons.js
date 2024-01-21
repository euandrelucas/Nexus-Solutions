const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const child_process = require('child_process');

module.exports = async (interaction) => {
	if (interaction.customId.startsWith('logs')) {
		await interaction.deferReply({ ephemeral: true });
		const userId = interaction.customId.split(';')[1];
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
			return interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
		});
		await interaction.editReply({ content: 'Logs enviados com sucesso!', ephemeral: true });
	}
};