const express = require('express');
const app = express();

app.use(express.static('backups'));

app.get('*', async (req, res) => {
	res.redirect('https://discord.com');
});

app.listen(2313);