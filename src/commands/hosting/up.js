/* eslint-disable max-nested-callbacks */
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
		const bot = interaction.options.getUser('bot');
		const botID = bot.id;
		const language = interaction.options.getString('language');
		const file = interaction.options.getAttachment('file');

		if (!file.name.endsWith('.zip')) {
			return interaction.reply({ content: 'O arquivo do bot deve estar em formato .zip!', ephemeral: true });
		}

		const data = {};
		const limits = {};
		const used = {
			ram: 0,
			cpu: 0
		};

		const hostinfo = await interaction.client.db.hosting.getCentral(interaction.guild.id);
		const userData = await interaction.client.db.user.checkUser(interaction.user.id);
		const userPremium = await interaction.client.db.user.getPremium(interaction.user.id);

		if (userPremium.premium === 'free') {
			data.type === 'free';
			const userBots = userData.hostBots;
			userBots.forEach(bot => {
				if (bot.ram > 512) {
					used.ram += bot.ram;
				}
				if (bot.cpu > 1) {
					used.cpu += bot.cpu;
				}
			});
			if (used.ram > 512) {
				limits.ram = 512;
				limits.cpu = 1;
				return interaction.reply({ content: 'Você atingiu o limite de RAM free!', ephemeral: true });
			}
			if (used.cpu > 1) {
				limits.ram = 512;
				limits.cpu = 1;
				return interaction.reply({ content: 'Você atingiu o limite de CPU free!', ephemeral: true });
			}
			if (hostinfo.freeBots === hostinfo.freeBotsLimit || hostinfo.freeBots > hostinfo.freeBotsLimit) {
				return interaction.reply({ content: 'Estamos sem vagas de bots gratuitos!', ephemeral: true });
			}
			limits.ram = 512;
			limits.cpu = 1;
		}

		if (userPremium.premium === 'bronze') {
			data.type === 'premium';
			const userBots = userData.hostBots;
			userBots.forEach(bot => {
				if (bot.ram > 1024) {
					used.ram += bot.ram;
				}
				if (bot.cpu > 2) {
					used.cpu += bot.cpu;
				}
			});
			if (used.ram > 1024) {
				limits.ram = 1024;
				limits.cpu = 2;
				return interaction.reply({ content: 'Você atingiu o limite de RAM bronze!', ephemeral: true });
			}
			if (used.cpu > 2) {
				limits.ram = 1024;
				limits.cpu = 2;
				return interaction.reply({ content: 'Você atingiu o limite de CPU bronze!', ephemeral: true });
			}
			if (hostinfo.bronzeBots === hostinfo.premiumBotsLimit || hostinfo.bronzeBots > hostinfo.premiumBotsLimit) {
				return interaction.reply({ content: 'Estamos sem vagas de bots bronze!', ephemeral: true });
			}
			limits.ram = 1024;
			limits.cpu = 2;
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

			const nexusConfigArray = nexusConfig.split('\n');
			const nexusConfigJSON = {};
			nexusConfigArray.forEach(line => {
				const lineArray = line.split('=');
				nexusConfigJSON[lineArray[0].toLowerCase().replace(/\r/g, '')] = lineArray[1].replace(/\r/g, '');
			});
			const informRam = Number(nexusConfigJSON.ram.replace(/MB/g, '').replace(/GB/g, '').replace(/G/g, ''));
			if (informRam >= limits.ram || used.ram >= limits.ram) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: `A quantidade de RAM não pode ser maior que ${Number(limits.ram) - used.ram}MB!`, ephemeral: true });
			}
			const informCPU = Number(nexusConfigJSON.cpu);
			if (informCPU > limits.cpu || used.cpu > limits.cpu) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: `A quantidade de CPU não pode ser maior que ${Number(limits.cpu) - Number(used.cpu)}!`, ephemeral: true });
			}
			if (!nexusConfigJSON.run.endsWith('.js')) {
				fs.rmdirSync(botSpecificDir, { recursive: true });
				return interaction.editReply({ content: 'O arquivo de inicialização do bot não foi encontrado!', ephemeral: true });
			}

			const freeRAM = limits.ram - used.ram;
			const freeCPU = limits.cpu - used.cpu;

			console.log(freeRAM, freeCPU);

			if (nexusConfigJSON.ram > freeRAM) return interaction.editReply({ content: 'A quantidade de RAM não pode ser maior que ' + freeRAM + 'MB', ephemeral: true });

			if (nexusConfigJSON.cpu > freeCPU) return interaction.editReply({ content: 'A quantidade de CPU não pode ser maior que ' + freeCPU + '%', ephemeral: true });

			const dockerImage = fs.readFileSync(path.resolve(`${botSpecificDir}/Dockerfile`), 'utf8');
			const dockerImageArray = dockerImage.split('\n');
			dockerImageArray[dockerImageArray.length - 1] = `CMD ["node", "${nexusConfigJSON.run}"]`;
			fs.writeFileSync(path.resolve(`${botSpecificDir}/Dockerfile`), dockerImageArray.join('\n'));

			const embed = new EmbedBuilder()
				.setTitle('Hospedagem')
				.setDescription(`O bot **${bot.username}** foi adicionado à fila de hospedagem!`)
				.setColor('Green')
				.setTimestamp();
			await interaction.editReply({ embeds: [embed] }).then(async () => {
				const logs = await interaction.client.channels.cache.get(config.logs.host);
				logs.send({
					content: `${interaction.client.emoji.loading} | O bot \`${bot.username.replace(/`/g, '')}\` foi adicionado à fila de hospedagem!`
				});
				logs.send({
					content: `${interaction.client.emoji.loading} | O bot \`${bot.username.replace(/`/g, '')}\` está sendo montado...`
				}).then(async (m) => {
					child_process.exec(`docker build -t ${botID} ${botSpecificDir}`, async (error, stdout) => {
						if (error) {
							m.edit({
								content: `${interaction.client.emoji.error} | Ocorreu um erro ao montar o bot \`${bot.username.replace(/`/g, '')}\`.\n\`\`\`${error}\`\`\``
							});
							return;
						}
						const output = stdout.split('\n');
						output.splice(0, output.length - 5);
						const stdout2 = output.join('\n');
						m.edit({
							content: `${interaction.client.emoji.loading} | O bot \`${bot.username.replace(/`/g, '')}\` está sendo montado...\n\`\`\`${stdout2.replace(/`/g, '')}\`\`\``
						});
						m.edit({
							content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi montado!`
						});
						logs.send({
							content: `${interaction.client.emoji.loading} | O bot \`${bot.username.replace(/`/g, '')}\` está sendo iniciado...`
						}).then(async (m2) => {
							child_process.exec(`docker run -d --name ${botID} --memory="${nexusConfigJSON.ram.replace(/MB/g, '').replace(/GB/g, '').replace(/G/g, '')}mb" --cpus="${nexusConfigJSON.cpu}" ${botID}`, async (error) => {
								if (error) {
									m2.edit({
										content: `${interaction.client.emoji.error} | Ocorreu um erro ao iniciar o bot \`${bot.username.replace(/`/g, '')}\`.\n\`\`\`${error}\`\`\``
									});
									return;
								}
								m2.edit({
									content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi iniciado!`
								});
								logs.send({
									content: `${interaction.client.emoji.loading} | O bot \`${bot.username.replace(/`/g, '')}\` está sendo adicionado ao banco de dados...`
								}).then(async (m3) => {
									await interaction.client.db.hbots.createBot(interaction.user.id, botID, language, Number(nexusConfigJSON.ram.replace(/MB/g, '').replace(/GB/g, '').replace(/G/g, '')), Number(nexusConfigJSON.cpu), botID);
									const user = await interaction.client.db.user.checkUser(interaction.user.id);
									if (!user) return;
									await interaction.client.db.user.addBot(interaction.user.id, botID, language, Number(nexusConfigJSON.ram.replace(/MB/g, '').replace(/GB/g, '').replace(/G/g, '')), Number(nexusConfigJSON.cpu));
									m3.edit({
										content: `${interaction.client.emoji.success} | O bot \`${bot.username.replace(/`/g, '')}\` foi adicionado ao banco de dados!`
									});
									child_process.exec('docker system prune -f', async (error) => {
										if (error) {
											logs.send({
												content: `${interaction.client.emoji.error} | Ocorreu um erro ao limpar o cache do docker.\n\`\`\`${error}\`\`\``
											});
											return;
										}
										logs.send({
											content: `${interaction.client.emoji.success} | O cache do docker foi limpo!`
										});
										await interaction.client.db.hosting.addFreeBot(interaction.guild.id);
										const central = await interaction.client.db.hosting.getCentral(interaction.guild.id);
										if (data.type === 'free') {
											const freeBotsChannel = await interaction.client.channels.cache.get(config.logs.freeBots);
											freeBotsChannel.edit({
												name: `➤💻︙Bots Free: ${central.freeBots}/${central.freeBotsLimit}`
											});
										}
										if (data.type === 'premium') {
											const premiumBotsChannel = await interaction.client.channels.cache.get(config.logs.premiumBots);
											premiumBotsChannel.edit({
												name: `➤💎︙Bots VIP: ${central.bronzeBots}${central.premiumBotsLimit === Infinity ? '' : `/${central.premiumBotsLimit}`}`
											});
										}
									});
								});
							});
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
