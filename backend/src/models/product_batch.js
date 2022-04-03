'use strict';
const { Model } = require('sequelize');
const db = require('./index');
module.exports = (sequelize, DataTypes) => {
	class product_batch extends Model {
		/**
		 *
		 * @param {db} models
		 */
		static associate(models) {
			// define association here
			product_batch.belongsTo(models.Product, { foreignKey: 'product_id' });
			product_batch.hasMany(models.Transaction, { foreignKey: 'product_batch_id' });
		}
	}
	product_batch.init(
		{
			quantity: DataTypes.INTEGER,
			product_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'product_batch',
		}
	);
	return product_batch;
};
