const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const child_process = require('child_process');
const config = require('../../config');
const extract = require('extract-zip');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('up')
		.setDescription('Adiciona um bot em nossa hospedagem!')
		.addUserOption(option =>
			option.setName('bot')
				.setDescription('O ID do bot que deseja hospedar')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('language')
				.setDescription('A linguagem do bot que deseja hospedar')
				.setRequired(true)
				.addChoices(
					{
						name: 'JavaScript',
						value: 'NodeJS'
					},
					{
						name: 'Python',
						value: 'Python'
					}
				))
		.addAttachmentOption(option =>
			option.setName('file')
				.setDescription('O arquivo do bot que deseja hospedar')
				.setRequired(true)),
	async execute (interaction) {
		await interaction.deferReply();
		const botID = interaction.options.getUser('bot').id;
		const language = interaction.options.getString('language');
		const file = interaction.options.getAttachment('file');

		if (!file.name.endsWith('.zip')) {
			return interaction.reply({ content: 'O arquivo do bot deve estar em formato .zip!', ephemeral: true });
		}

		const response = await axios.get(file.url, { responseType: 'arraybuffer' });
		const botFile = response.data;
		const tempDir = './temp';
		const botSpecificDir = path.resolve(path.join(tempDir, botID));

		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir);
		}

		try {
			if (fs.existsSync(botSpecificDir)) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
			}

			fs.mkdirSync(botSpecificDir);

			fs.writeFileSync(`${botSpecificDir}/bot.zip`, botFile);

			await extract(path.resolve(`${botSpecificDir}/bot.zip`), { dir: botSpecificDir });

			fs.unlinkSync(path.resolve(`${botSpecificDir}/bot.zip`));

			if (!fs.existsSync(path.resolve(`${botSpecificDir}/package.json`))) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: 'O arquivo package.json não foi encontrado!', ephemeral: true });
			}

			if (fs.existsSync(path.resolve(`${botSpecificDir}/Dockerfile`))) {
				fs.unlinkSync(path.resolve(`${botSpecificDir}/Dockerfile`));
			}

			fs.copyFileSync(path.resolve(`./src/Docker/${language}/Dockerfile`), path.resolve(`${botSpecificDir}/Dockerfile`));

			if (!fs.existsSync(path.resolve(`${botSpecificDir}/nexus.config`))) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: 'O arquivo config.nexus não foi encontrado!', ephemeral: true });
			}

			const nexusConfig = fs.readFileSync(path.resolve(`${botSpecificDir}/nexus.config`), 'utf8');

			console.log(nexusConfig);
			const nexusConfigArray = nexusConfig.split('\n');
			const nexusConfigJSON = {};
			nexusConfigArray.forEach(line => {
				const lineArray = line.split('=');
				nexusConfigJSON[lineArray[0].toLowerCase().replace(/\r/g, '')] = lineArray[1].replace(/\r/g, '');
			});

			if (!nexusConfigJSON.run.endsWith('.js')) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: 'O arquivo de inicialização do bot não foi encontrado!', ephemeral: true });
			}

			if (nexusConfigJSON.ram > 512) return interaction.editReply({ content: 'A quantidade de RAM não pode ser maior que 512MB!', ephemeral: true });

			if (nexusConfigJSON.cpu > 2) return interaction.editReply({ content: 'A quantidade de CPU não pode ser maior que 2!', ephemeral: true });

			const dockerImage = fs.readFileSync(path.resolve(`${botSpecificDir}/Dockerfile`), 'utf8');
			const dockerImageArray = dockerImage.split('\n');
			dockerImageArray[dockerImageArray.length - 1] = `CMD ["node", "${nexusConfigJSON.run}"]`;
			fs.writeFileSync(path.resolve(`${botSpecificDir}/Dockerfile`), dockerImageArray.join('\n'));

			const embed = new EmbedBuilder()
				.setTitle('Hospedagem')
				.setDescription(`O bot ${botID} foi adicionado à fila de hospedagem!`)
				.setColor('Green')
				.setTimestamp();
			await interaction.editReply({ embeds: [embed] }).then(async () => {
				const logs = await interaction.client.channels.cache.get(config.logs.host);
				logs.send({
					content: `${interaction.client.emoji.loading} | O bot ${botID} foi adicionado à fila de hospedagem!`
				});
				// Dê build no container
				child_process.exec(`docker build -t ${botID} ${botSpecificDir}`, async (error, stdout, stderr) => {
					// Envie no canal de logs que o container está sendo montado
					logs.send({
						content: `${interaction.client.emoji.loading} | O bot ${botID} está sendo montado...`
					});
					// Verifique se houve algum erro
					if (error) {
						// Se houver, envie no canal de logs
						logs.send({
							content: `${interaction.client.emoji.error} | Ocorreu um erro ao montar o bot ${botID}.\n\`\`\`${error}\`\`\``
						});
						// E retorne
						return;
					}
					// Envie no canal de logs que o container foi montado
					logs.send({
						content: `${interaction.client.emoji.success} | O bot ${botID} foi montado!`
					});
					// Envie no canal de logs que o container está sendo iniciado
					logs.send({
						content: `${interaction.client.emoji.loading} | O bot ${botID} está sendo iniciado...`
					});
					// Inicie o container
					child_process.exec(`docker run -d --name ${botID} --memory="${nexusConfigJSON.ram}mb" --cpus="${nexusConfigJSON.cpu}" ${botID}`, async (error, stdout, stderr) => {
						// Verifique se houve algum erro
						if (error) {
							// Se houver, envie no canal de logs
							logs.send({
								content: `${interaction.client.emoji.error} | Ocorreu um erro ao iniciar o bot ${botID}.\n\`\`\`${error}\`\`\``
							});
							// E retorne
							return;
						}
						// Envie no canal de logs que o container foi iniciado
						logs.send({
							content: `${interaction.client.emoji.success} | O bot ${botID} foi iniciado!`
						});
						// Envie no canal de logs que o bot está sendo adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.loading} | O bot ${botID} está sendo adicionado ao banco de dados...`
						});
						// Adicione o bot ao banco de dados usando interaction.client.db.hbots
						/*
                        Seguindo esse modelo:
                        */
						await interaction.client.db.hbots.createBot(interaction.user.id, botID, language, nexusConfigJSON.ram, nexusConfigJSON.cpu, botID);
						// Envie no canal de logs que o bot foi adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.success} | O bot ${botID} foi adicionado ao banco de dados!`
						});
						// Envie no canal de logs que o bot está sendo adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.loading} | O bot ${botID} está sendo adicionado ao banco de dados...`
						});
						// Envie no canal de logs que o bot foi adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.success} | O bot ${botID} foi adicionado ao banco de dados!`
						});
						// Envie no canal de logs que o bot está sendo adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.loading} | O bot ${botID} está sendo adicionado ao banco de dados...`
						});
						// Envie no canal de logs que o bot foi adicionado ao banco de dados
						logs.send({
							content: `${interaction.client.emoji.success} | O bot ${botID} foi adicionado ao banco de dados!`
						});
					});
				});
			});
		}
		catch (error) {
			console.error('Erro ao processar o arquivo do bot:', error);
			interaction.editReply({ content: 'Ocorreu um erro ao processar o arquivo do bot.', ephemeral: true });
		}
	},
};
