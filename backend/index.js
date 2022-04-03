const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Transaction, Merchant, Product } = require('./src/models');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.send('Hello World!');
	// const merchant_data = req.body

	// const merchant = await Merchant.create(merchant_data)
	// const product = await Product.create({name: 'myproiduct', merchant_id: merchant.id})
});

app.post('/create_merchant', async (req, res) => {
	const merchant_data = req.body;
	const merchant = await Merchant.create(merchant_data);
	res.json(merchant);
});

app.post('/create_product', async (req, res) => {
	const product_data = req.body;
	const product = await Product.create(product_data);
	res.json(product);
});

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
