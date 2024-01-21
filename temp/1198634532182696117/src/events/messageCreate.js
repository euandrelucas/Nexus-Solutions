const { Events, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const emoji = require('../modules/emojis.json');
const config = require('../config.js');

module.exports = {
	name: Events.MessageCreate,
	async execute (message) {
		await message.client.db.guild.checkGuild(message.guild.id);
		if (message.author.bot) return;
		if (message.channel.type === ChannelType.DM) return;
		if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
			const client = message.client;
			const guild = message.guild;
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
				.setDescription(`É um prazer estar em seu servidor! Para ver meus comandos, use </${command.name}:${command.id}>.`)
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
			await message.channel.send({ embeds: [embed] });
		}

		const autoThreadEnabled = await message.client.db.guild.getAutoThreadStatus(message.guild.id);
		if (autoThreadEnabled) {
			const autoThreadChannels = await message.client.db.guild.getAutoThreadChannels(message.guild.id);
			if (!autoThreadChannels.includes(message.channel.id)) return;
			let startMessage = message.content;
			if (startMessage.length === 0) {
				startMessage = 'Thread criada automaticamente';
			}
			const thread = await message.startThread({
				name: message.content.slice(0, 10) + '...',
				autoArchiveDuration: 1440,
				reason: 'AutoThread',
			}).catch(async (e) => console.log(e));
			const achiveButton = new ButtonBuilder()
				.setCustomId(`archivet;${message.author.id}`)
				.setLabel('Arquivar')
				.setEmoji(emoji.archive.replace(/</g, '').replace(/>/g, ''))
				.setStyle(ButtonStyle.Secondary);
			const editButton = new ButtonBuilder()
				.setCustomId(`editt;${message.author.id}`)
				.setLabel('Editar nome')
				.setEmoji(emoji.lapis.replace(/</g, '').replace(/>/g, ''))
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder()
				.addComponents(achiveButton, editButton);
			await thread.send({
				content: `Thread criada automaticamente por ${message.author}`,
				allowedMentions: { parse: [] },
				components: [row],
			}).catch(async (e) => console.log(e));
		}
	},
};