'use strict';
const { Model } = require('sequelize');
const db = require('../models/index');

module.exports = (sequelize, DataTypes) => {
	class supply_carbon_metadata extends Model {
		/**
		 *
		 * @param {db} models
		 */
		static associate(models) {
			// define association here
			supply_carbon_metadata.belongsTo(models.Product, { foreignKey: 'product_id' });
			supply_carbon_metadata.belongsTo(models.SupplyChainParty, {
				foreignKey: 'supply_chain_parties_id',
			});
		}
	}
	supply_carbon_metadata.init(
		{
			energy_type: DataTypes.TEXT,
			fuel_used: DataTypes.FLOAT,
			transportation_type: DataTypes.TEXT,
			material_type: DataTypes.STRING,
			material_amount: DataTypes.FLOAT,
			supply_chain_parties_id: DataTypes.INTEGER,
			product_id: DataTypes.INTEGER,
			co2_emission: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: 'supply_carbon_metadata',
		}
	);
	return supply_carbon_metadata;
};
