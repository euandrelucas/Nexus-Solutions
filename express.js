const express = require('express');
const app = express();

app.use(express.static('backups'));

app.get('*', async (req, res) => {
	res.redirect('https://discord.gg/7XJj7y9');
});

app.listen(2313);