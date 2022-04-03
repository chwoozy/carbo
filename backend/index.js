const express = require('express');
const { sequelize, Transaction, Merchant, Product } = require('./src/models');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
	// const merchant_data = req.body

	// const merchant = await Merchant.create(merchant_data)
	// const product = await Product.create({name: 'myproiduct', merchant_id: merchant.id})
});

app.post('/create_merchant', (req, res) => {
  const merchant_data = req.body;
  const merchant = await Merchant.create(merchant_data);
  res.json(merchant)
})

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
