const { SlashCommandBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const child_process = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bots')
		.setDescription('Lista os bots que você tem hospedado!'),
	async execute (interaction) {
		const user = await interaction.client.db.user.getUser(interaction.user.id);
		const bots = user.hostBots;
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
		console.log(collector);
		if (collector.customId === `select;${interaction.user.id};bots`) {
			// Obtenha os status do container do bot
			const status = child_process.execSync(`docker container inspect ${collector.values[0]} --format '{{json .State}}'`).toString();
			const statusJSON = JSON.parse(status);
			console.log(statusJSON);
		}
	},
};