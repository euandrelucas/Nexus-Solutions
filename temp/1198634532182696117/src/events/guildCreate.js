const { Events, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const emoji = require('../modules/emojis.json');
const config = require('../config.js');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute (guild) {
		const client = guild.client;
		await guild.channels.fetch();
		console.log(`[CLIENT] Fui adicionada em ${guild.name} (${guild.id})`.yellow);
		const data = await client.db.bot.getCommands();
		const commands = data.commands;
		const command = commands.find(command => command.name === 'ajuda');
		const devInfo1 = await client.users.cache.get('717766639260532826') ? client.users.cache.get('717766639260532826') : await client.users.fetch('717766639260532826', {
			force: true
		});
		const devInfo2 = await client.users.cache.get('742798447253651506') ? client.users.cache.get('742798447253651506') : await client.users.fetch('742798447253651506', {
			force: true
		});
		const embed = new EmbedBuilder()
			.setTitle(`${emoji.hello} Olá, eu sou a ${client.user.username}!`)
			.setDescription(`É um prazer ser adicionada em seu servidor! Para ver meus comandos, use </${command.name}:${command.id}>.`)
			.addFields(
				{
					name: 'Links',
					value: `[Convite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)\n[Servidor de Suporte](https://discord.gg/${config.supportServer})\n[Me adicione em seu servidor](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
				},
				{
					name: 'Desenvolvedores',
					value: `${devInfo1.globalName} \`(${devInfo1.id})\`\n${devInfo2.globalName} \`(${devInfo2.id})\``,
				}
			)
			.setColor('#cd949d')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: `${guild.name} (${guild.id})`,
				iconURL: guild.iconURL({ dynamic: true, size: 4096 })
			});
		const channel = await guild.channels.cache.get(guild.systemChannelId);
		await channel.send({ embeds: [embed] }).catch(() => {
			guild.channels.cache.map(async (channel) => {
				if (channel.type !== ChannelType.GuildText) return;
				if (!channel.permissionsFor(client.user.id).has(PermissionFlagsBits.SendMessages)) return;
				await channel.send({ embeds: [embed] });
			});
		});
		const owner = await client.users.cache.get(guild.ownerId) ? client.users.cache.get(guild.ownerId) : await client.users.fetch(guild.ownerId, {
			force: true
		});
		const logChannel = await client.channels.cache.get(config.devLogs.guildJoin);
		const embedLog = new EmbedBuilder()
			.setTitle('Fui adicionada em um servidor')
			.setDescription(`Fui adicionado em **${guild.name}** \`(${guild.id})\`\n**Membros:** ${guild.memberCount.toLocaleString('pt-BR')}\n**Criado em:** ${guild.createdAt.toLocaleString('pt-BR')}`)
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
			.setTimestamp()
			.setFooter({ text: `${client.user.tag} (${client.user.id})`, iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
			.setColor('#cd949d');
		await logChannel.send({ embeds: [embedLog] });
	},
};