const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Mostra informações do servidor!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('icon')
				.setDescription('Mostra o ícone do servidor').addStringOption(option =>
					option.setName('id')
					  .setDescription('Id of another server')
					  .setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Mostra informações do servidor').addStringOption(option =>
					option.setName('id')
					  .setDescription('Id of another server')
					  .setRequired(false))),
	async execute (interaction) {
		if (interaction.options.getSubcommand() === 'icon') {
			let guild = interaction.guild;

			let args = [interaction.options.getString('id')];
			try {

				if (args[0]) {
					if (!isNaN(args[0])) {
						guild = interaction.client.guilds.cache.get(args[0]);

					}
				}

			}
			catch {
				interaction.reply(`Sinto muito, mas não consegui localizar o servidor: \`${args[0].replace(/`/g, '')}\` `);
			}

			if (!guild.icon) return interaction.reply('Esse servidor não tem um icone');

			const embed = new EmbedBuilder()
				.setTitle(`Ícone de \`${guild.name}\``)
				.setImage(guild.iconURL({ dynamic: true, size: 2048 }))
				// .setTimestamp()
				 .setColor('#cd949d')
				.setFooter({ text: `${interaction.user.tag} (${interaction.user.id})` });


			const menu = new StringSelectMenuBuilder()
				.setCustomId('GuildIcon')
				.setPlaceholder('Selecione o servidor');


			let array = [];

			interaction.client.guilds.cache.map(async (a) => {
				console.log(a.name);
				if (a.id === interaction.guild.id) return;
				if (a.members.cache.get(interaction.user.id)) {
					console.log('Membro detectado em : ', guild.name);

					let owner = await interaction.client.users.cache.get(a.ownerId) ? interaction.client.users.cache.get(a.ownerId) : await interaction.client.users.fetch(a.ownerId, {
						force: true
					});

					array.push({
						label: a.name,
						description: `ID: ${a.id} | Dono: ${owner.username}`,
						value: a.id,
					});
				}
			});

			setTimeout(() => {
			 menu.addOptions(array);
				const row = new ActionRowBuilder()
					.addComponents(menu);

				interaction.followUp({ content: 'Achei que talvez você ficaria curioso de ver o ícone desses outros servidores também:', components: [row], ephemeral: true });

	   }, 5000);

	   interaction.reply({ content: interaction.user.toString(), embeds: [embed] });
		}
		else {await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);}
	},
};