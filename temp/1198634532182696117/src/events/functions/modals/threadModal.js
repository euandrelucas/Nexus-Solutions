const emoji = require('../../../modules/emojis.json');

module.exports = async (interaction) => {
	if (interaction.customId.startsWith('editThread')) {
		const thread = await interaction.channel;
		const userId = interaction.customId.split(';')[1];
		if (userId !== interaction.user.id) return interaction.reply({ content: `${emoji.error} ${interaction.member} **|** Você não pode editar essa thread!`, ephemeral: true });
		const newName = interaction.fields.fields.get('threadName').value;
		await interaction.reply({ content: `${emoji.success} Nome da thread editado com sucesso!`, ephemeral: true }).then(async () => {
			await thread.setName(newName);
		});
	}
};