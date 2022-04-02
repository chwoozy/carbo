const { Model } = require('sequelize');
const db = require('../models/index');

module.exports = (sequelize, DataTypes) => {
	class transaction extends Model {
		/**
		 *
		 * @param {db} models
		 */
		static associate(models) {
			// define association here
			const { SupplyCarbonMetadata } = models;
			transaction.belongsTo(models.SupplyCarbonMetadata);
		}
	}
	transaction.init(
		{
			type: DataTypes.TEXT,
			supply_carbon_metadata_id: DataTypes.INTEGER,
			nft_address: DataTypes.TEXT,
		},
		{
			sequelize,
			modelName: 'transaction',
		}
	);
	return transaction;
};
