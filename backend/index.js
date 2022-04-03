const express = require('express');
const bodyParser = require('body-parser');
const {
	sequelize,
	Transaction,
	Merchant,
	Product,
	SupplyChainParty,
	SupplyCarbonMetadata,
} = require('./src/models');
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
	const product = await Product.create(req.body);
	res.json(product);
});

app.post('/create_supply_chain_party', async (req, res) => {
	const supplyChainParty = await SupplyChainParty.create(req.body);
	res.json(supplyChainParty);
});

app.post('/calculate_transaction', async (req, res) => {
	const supply_carbon_metadata = await SupplyCarbonMetadata.create(req.body);
	res.json(supply_carbon_metadata);
});

app.post('/store_transaction', async (req, res) => {
	const transaction = await Transaction.create(req.body);
	res.json(transaction);
});

app.get('/get_supply_chain_parties_for_merchant', async (req, res) => {
	const supply_chain_parties = await SupplyChainParty.getAttributes({
		merchant_id: req.merchant_id,
	});
	res.json(supply_chain_parties);
});

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
