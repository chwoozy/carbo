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
			transaction.belongsTo(models.SupplyCarbonMetadata, {
				foreignKey: 'supply_carbon_metadata_id',
			});
			transaction.belongsTo(models.ProductBatch, { foreignKey: 'product_batch_id' });
		}
	}
	transaction.init(
		{
			type: DataTypes.TEXT,
			supply_carbon_metadata_id: DataTypes.INTEGER,
			nft_address: DataTypes.TEXT,
			product_batch_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'transaction',
		}
	);
	return transaction;
};
