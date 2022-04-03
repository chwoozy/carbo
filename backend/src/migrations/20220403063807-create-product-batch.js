'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('product_batches', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			quantity: {
				type: Sequelize.INTEGER,
			},
			product_id: {
				type: Sequelize.INTEGER,
				references: { model: 'products', key: 'id' },
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('product_batches');
	},
};
