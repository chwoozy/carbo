const express = require('express');
const bodyParser = require('body-parser');
const {
	sequelize,
	Transaction,
	Merchant,
	Product,
	SupplyChainParty,
	SupplyCarbonMetadata,
	ProductBatch,
} = require('./src/models');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({ origin: '*' }));

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
		const product_batch = await ProductBatch.create({
			quantity: req.body.quantity,
			product_id: req.body.product_id,
		});
		res.json({ supply_carbon_metadata, product_batch });
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
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const supply_chain_parties = await SupplyChainParty.findAll({
			where: {
				merchant_id: req.query.merchant_id,
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
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
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
	const productBatches = ProductBatch.findAll({
		where: {
			product_id: products.map((product) => product.id),
		},
	});
	const totalQuantity = productBatches.reduce((prev, curr) => prev + curr.quantity, 0);
	return totalQuantity;
};

app.get('/get_total_emission', async (req, res) => {
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
			},
		});
		const emissions = await totalEmission(products);
		res.json({ totalEmission: emissions });
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.get('/emission_per_unit', async (req, res) => {
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
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
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
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
app.get('/carbon_emission_per_day', async (req, res) => {
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
			},
		});
		const supplyCarbonMetadatas = await SupplyCarbonMetadata.findAll({
			where: { product_id: products.map((product) => product.id) },
		});

		const result = {};

		supplyCarbonMetadatas.forEach((supplyCarbonMetadata) => {
			const dateCreated = new Date(supplyCarbonMetadata.createdAt).toDateString();

			if (result[dateCreated]) {
				result[dateCreated] = result[dateCreated] + supplyCarbonMetadata.co2_emission;
			} else {
				result[dateCreated] = supplyCarbonMetadata.co2_emission;
			}
		});
		res.json(result);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// get all transaction

app.get('/get_transactions', async (req, res) => {
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
			},
		});
		const supplyCarbonMetadatas = await SupplyCarbonMetadata.findAll({
			where: { product_id: products.map((product) => product.id) },
		});

		const transactions = await Transaction.findAll({
			where: {
				supply_carbon_metadata_id: supplyCarbonMetadatas.map((item) => item.id),
			},
		});
		res.json(transactions);
	} catch (error) {
		res.json({ error: error.message });
	}
});

//
app.get('/emission_per_product', async (req, res) => {
	if (req.query.merchant_id === undefined) {
		res.json({ error: 'merchant id is undefined' });
		return;
	}
	try {
		const products = await Product.findAll({
			where: {
				merchant_id: req.query.merchant_id,
			},
			include: ProductBatch,
		});

		const newProducts = products
			.map((product) => {
				const productObject = product;

				const emissions = product.product_batches.reduce((prev, curr) => prev + curr.quantity, 0);

				productObject.total_emission = emissions;

				return productObject;
			})
			.sort((a, b) => {
				if (a.total_emission < b.total_emission) {
					return -1;
				} else if (a.total_emission < b.total_emission) {
					return 1;
				}
				return 0;
			});
		res.json(newProducts);
	} catch (error) {
		res.json({ error: error.message });
	}
});

app.listen(port, async () => {
	console.log(`App listening on port ${port}`);
	await sequelize.authenticate();
});
