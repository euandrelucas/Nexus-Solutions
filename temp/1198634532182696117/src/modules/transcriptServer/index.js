const cheerio = require('cheerio');
const fastify = require('fastify')({ logger: true });
const axios = require('axios');

const port = 80;

// Implementação de cache simples (pode precisar de ajustes)
const cache = new Map();

function isBotGenerated (html) {
	const $ = cheerio.load(html);

	const profiles = $('script').filter((i, el) => {
		const scriptContent = $(el).html();
		return scriptContent.includes('$discordMessage={profiles:');
	});

	if (profiles.length === 0) {
		return false;
	}

	const scriptContent = profiles.html();
	const botProfileIndex = scriptContent.indexOf('"bot":true');

	if (botProfileIndex === -1) {
		return false;
	}

	const discordScript = $('script[src*="discord-components-core"]').length > 0;

	return discordScript;
}

fastify.get('/transcript', async (request, reply) => {
	try {
		const link = request.query.link;

		if (!link) {
			return reply.status(400).send('Parâmetro "link" ausente na URL.');
		}

		// Verificar cache
		if (cache.has(link)) {
			return reply.header('Content-Type', 'text/html').send(cache.get(link));
		}

		const response = await axios.get(link);

		const isGeneratedByBot = isBotGenerated(response.data);

		if (!isGeneratedByBot) {
			return reply.status(400).send('A mensagem não foi gerada por um bot.');
		}

		// Armazenar no cache e enviar resposta com Content-Type definido
		cache.set(link, response.data);
		reply.header('Content-Type', 'text/html').send(response.data);
	}
	catch (error) {
		console.error(error);
		reply.status(500).send('Erro interno do servidor.');
	}
});

fastify.get('*', async (request, reply) => {
	reply.redirect('https://lyrabot.online');
});

// Inicie o servidor Fastify
fastify.listen(port, '0.0.0.0', (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`[TRANSCRIPT] Servidor rodando em ${address}`.green);
});

// Inicie o servidor Fastify
/*
fastify.listen({ port: port, }, (err, address) => {
	console.log(`[TRANSCRIPT] Servidor rodando em ${address}`);
});
*/