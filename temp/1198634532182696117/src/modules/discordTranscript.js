const discordTranscripts = require('discord-html-transcripts');

const generate = async function(channel) {
	const attachment = await discordTranscripts.createTranscript(channel, {
		returnType: 'attachment',
		footerText: 'Exportada{s} {number} mensagens - Lyra',
		poweredBy: false,
		ssr: true
	});
	return attachment;
};

module.exports = {
	generate,
};