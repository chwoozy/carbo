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
	const supply_chain_parties = await SupplyChainParty.findAll({
		where: {
			merchant_id: req.body.merchant_id,
		},
	});
	res.json(supply_chain_parties);
});

/**
 * gets all the products that a merchant has
 */
app.get('/get_product_id_for_merchant', async (req, res) => {
	const products = await Product.findAll({
		where: {
			merchant_id: req.body.merchant_id,
		},
	});
	res.json(products);
});

const totalEmission = async (merchant_id) => {
	const products = await Product.findAll({
		where: {
			merchant_id,
		},
	});

	const totalEmission = (
		await SupplyCarbonMetadata.findAll({
			where: { product_id: products.map((product) => product.id) },
		})
	).reduce((prev, curr) => prev + curr.co2, 0);
	console.log(totalEmission);
	return totalEmission;
};

const totalQuantity = async (merchant_id) => {
	const totalQuantity = (
		await Product.findAll({
			where: {
				merchant_id,
			},
		})
	).reduce((prev, curr) => prev + curr.quantity, 0);
	console.log(totalQuantity);
	return totalQuantity;
};
totalEmission(7);
totalQuantity(7);
app.get('/get_total_emission', async (req, res) => {
	res.json({ totalEmission: totalEmission(req.body.merchant_id) });
});

app.get('/emission_per_unit', async (req, res) => {
	const merchant_id = req.body.merchant_id;
	res.json({ emission_per_unit: totalEmission(merchant_id) / totalQuantity(merchant_id) });
});

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
