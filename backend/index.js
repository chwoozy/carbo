const express = require('express');
const { sequelize, Transaction, Merchant } = require('./src/models');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
