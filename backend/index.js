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
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ allowedHeaders: 'Access-Control-Allow-Origin', origin: '*' }));

app.get('/', (req, res) => {
	res.send('Hello World!');
	// const merchant_data = req.body

	// const merchant = await Merchant.create(merchant_data)
	// const product = await Product.create({name: 'myproiduct', merchant_id: merchant.id})
});

app.post('/create_merchant', async (req, res) => {
	const merchant_data = req.body;
	try {
		const merchant = await Merchant.create(merchant_data);
		res.json(merchant);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.post('/create_product', async (req, res) => {
	try {
		const product = await Product.create(req.body);
		res.json(product);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.post('/create_supply_chain_party', async (req, res) => {
	try {
		const supplyChainParty = await SupplyChainParty.create(req.body);
		res.json(supplyChainParty);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.post('/calculate_transaction', async (req, res) => {
	try {
		const supply_carbon_metadata = await SupplyCarbonMetadata.create(req.body);
		res.json(supply_carbon_metadata);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.post('/store_transaction', async (req, res) => {
	try {
		const transaction = await Transaction.create(req.body);
		res.json(transaction);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.get('/get_supply_chain_parties_for_merchant', async (req, res) => {
	if (!req.body.merchant_id) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const supply_chain_parties = await SupplyChainParty.findAll({
			where: {
				merchant_id: req.body.merchant_id,
			},
		});
		res.json(supply_chain_parties);
	} catch (error) {
		res.json({ error: error.message });
	}
});

/**
 * gets all the products that a merchant has
 */
app.get('/get_product_id_for_merchant', async (req, res) => {
	if (!req.body.merchant_id) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.body.merchant_id,
			},
		});
		res.json(products);
	} catch (error) {
		res.json({ error: error.message });
	}
});

const totalEmission = async (products) => {
	const totalEmission = (
		await SupplyCarbonMetadata.findAll({
			where: { product_id: products.map((product) => product.id) },
		})
	).reduce((prev, curr) => prev + curr.co2_emission, 0);
	return totalEmission;
};

const totalQuantity = async (products) => {
	const totalQuantity = products.reduce((prev, curr) => prev + curr.quantity, 0);
	return totalQuantity;
};

app.get('/get_total_emission', async (req, res) => {
	if (!req.body.merchant_id) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.body.merchant_id,
			},
		});
		const emissions = await totalEmission(products);
		res.json({ totalEmission: emissions });
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.get('/emission_per_unit', async (req, res) => {
	if (!req.body.merchant_id) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.body.merchant_id,
			},
		});
		const emissions = await totalEmission(products);
		const quantities = await totalQuantity(products);
		const emission_per_unit = emissions / quantities;
		res.json({
			emission_per_unit,
		});
	} catch (error) {
		res.json({ error: error.message });
	}
});

// list of total number of products row inserted per day
app.get('/number_of_products_per_day', async (req, res) => {
	if (!req.body.merchant_id) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.body.merchant_id,
			},
		});

		const result = {};

		products.forEach((product) => {
			const dateCreated = new Date(product.createdAt).toDateString();

			if (result[dateCreated]) {
				result[dateCreated]++;
			} else {
				result[dateCreated] = 1;
			}
		});

		res.json(result);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// total amount of carbon emissions per day

// get all transaction

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
