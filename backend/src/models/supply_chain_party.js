'use strict';
const { Model } = require('sequelize');
const db = require('../models/index');
module.exports = (sequelize, DataTypes) => {
	class supply_chain_party extends Model {
		/**
		 *
		 * @param {db} models
		 */
		static associate(models) {
			// define association here
			supply_chain_party.belongsTo(models.Merchant);
		}
	}
	supply_chain_party.init(
		{
			name: DataTypes.TEXT,
			wallet_address: DataTypes.TEXT,
			merchant_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'supply_chain_party',
		}
	);
	return supply_chain_party;
};
