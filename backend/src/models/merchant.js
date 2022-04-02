'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class merchant extends Model {
		/**
		 *
		 * @param {db} models
		 */
		static associate(models) {
			// define association here
		}
	}
	merchant.init(
		{
			name: DataTypes.TEXT,
		},
		{
			sequelize,
			modelName: 'merchant',
		}
	);
	return merchant;
};
