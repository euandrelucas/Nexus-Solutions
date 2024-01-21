const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const emoji = require('../../../modules/emojis.json');

module.exports = async (interaction) => {
	if (interaction.customId.startsWith('archivet')) {
		const thread = await interaction.channel;
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Você não pode arquivar essa thread!`, ephemeral: true });
		await interaction.reply({ content: `${emoji.success} ${interaction.member} **|** Thread arquivada com sucesso!`, ephemeral: true }).then(async () => {
			await thread.setArchived(true);
		});
	}
	if (interaction.customId.startsWith('editt')) {
		const thread = await interaction.channel;
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Você não pode editar essa thread!`, ephemeral: true });
		const modal = new ModalBuilder()
			.setCustomId(`editThread;${userId}`)
			.setTitle('Editar nome da thread');

		const nameInput = new TextInputBuilder()
			.setCustomId('threadName')
			.setLabel('Qual será o novo nome da Thread?')
			.setPlaceholder('Escreva aqui!')
			.setMinLength(1)
			.setMaxLength(100)
			.setRequired(true)
			.setValue(thread.name)
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
		modal.addComponents(firstActionRow);

		await interaction.showModal(modal);
	}
};