const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
	name: Events.InteractionCreate,
	async execute (interaction) {
		await interaction.client.db.guild.checkGuild(interaction.guild.id);
		const manutationStatus = await interaction.client.db.bot.getManutation();
		const dev = ['742798447253651506', '717766639260532826'];
		if (manutationStatus.enabled === true && !dev.includes(interaction.user.id)) {
			const embed = new EmbedBuilder()
				.setTitle('Manutenção')
				.setDescription('O bot foi colocado em manutenção por meu desenvolvedor.')
				.addFields(
					{
						name: 'Motivo:',
						value: manutationStatus.reason,
					}
				)
				.setColor('Red')
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: 'Nossa equipe está trabalhando fortemente! Obrigado pela compreensão!',
					iconURL: interaction.client.user.displayAvatarURL({ dynamic: true, size: 4096 })
				})
				.setTimestamp();
			return interaction.reply({ embeds: [embed] });
		}
		if (interaction.isModalSubmit()) {
			require('./functions/modals/threadModal')(interaction);
		}
		if (interaction.isButton()) {
			require('./functions/buttons/tickets')(interaction);
			require('./functions/buttons/threads')(interaction);
		}
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				console.error(error);
			}
		}

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
			const logChannel = await interaction.client.channels.cache.get(config.devLogs.commands);
			const embed = new EmbedBuilder()
				.setTitle('Comando executado')
				.setDescription(`O comando \`${interaction.commandName}\` foi executado por ${interaction.user} \`(${interaction.user.id})\``)
				.addFields(
					{ name: 'Servidor', value: `${interaction.guild.name} \`(${interaction.guild.id})\``, inline: true },
					{ name: 'Canal', value: `#${interaction.channel.name} \`(${interaction.channel.id})\``, inline: true },
					{ name: 'Opções', value: interaction.options.data.length > 0 ? interaction.options.data.map(option => `\`${option.name}\`: \`${option.value}\``).join('\n') : 'Nenhuma', inline: false },
				)
				.setTimestamp()
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
				.setColor('#cd949d');
			await logChannel.send({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};