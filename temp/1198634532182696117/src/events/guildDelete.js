const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute (guild) {
		console.log(`[CLIENT] Fui removida em ${guild.name} (${guild.id})`.red);
		const client = guild.client;
		const owner = await client.users.cache.get(guild.ownerId) ? client.users.cache.get(guild.ownerId) : await client.users.fetch(guild.ownerId, {
			force: true
		});
		const logChannel = await client.channels.cache.get(config.devLogs.guildLeave);
		const embed = new EmbedBuilder()
			.setTitle('Fui removida de um servidor')
			.setDescription(`Fui removida em **${guild.name}** \`(${guild.id})\`\n**Membros:** ${guild.memberCount.toLocaleString('pt-BR')}\n**Criado em:** ${guild.createdAt.toLocaleString('pt-BR')}`)
			.addFields(
				{
					name: 'Dono',
					value: `${owner.globalName} \`(${owner.id})\``,
					inline: true
				},
				{
					name: 'Servidor',
					value: `${guild.name} \`(${guild.id})\``,
					inline: true
				}
			)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }))
			.setColor('Red')
			.setTimestamp()
			.setFooter({ text: `${client.user.tag} (${client.user.id})`, iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) });
		logChannel.send({ embeds: [embed] });
	},
};