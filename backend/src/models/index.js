const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config);

const SupplyCarbonMetadata = require('./supply_carbon_metadata')(sequelize, Sequelize.DataTypes);
const Ghg = require('./ghg')(sequelize, Sequelize.DataTypes);
const Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
const Product = require('./product')(sequelize, Sequelize.DataTypes);
const Merchant = require('./merchant')(sequelize, Sequelize.DataTypes);
const SupplyChainParty = require('./supply_chain_party')(sequelize, Sequelize.DataTypes);
const db = {
	SupplyCarbonMetadata,
	Ghg,
	Transaction,
	Product,
	Merchant,
	SupplyChainParty,
};

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
