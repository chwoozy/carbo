'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return queryInterface
			.addColumn('supply_carbon_metadata', 'co2_emission', Sequelize.FLOAT)
			.then(() => {
				return queryInterface.dropTable('ghgs');
			});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		return queryInterface.removeColumn('supply_carbon_metadata', 'co2_emission');
	},
};
