'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('transactions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.TEXT,
			},
			supply_carbon_metadata_id: {
				type: Sequelize.INTEGER,
				references: { model: 'supply_carbon_metadata', key: 'id' },
			},
			ghg_id: {
				type: Sequelize.INTEGER,
				references: { model: 'ghgs', key: 'id' },
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
		await queryInterface.dropTable('transactions');
	},
};
