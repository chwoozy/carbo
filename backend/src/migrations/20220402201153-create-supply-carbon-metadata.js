'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supply_carbon_metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      energy_type: {
        type: Sequelize.TEXT
      },
      fuel_used: {
        type: Sequelize.FLOAT
      },
      transportation_type: {
        type: Sequelize.TEXT
      },
      material_type: {
        type: Sequelize.STRING
      },
      material_amount: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('supply_carbon_metadata');
  }
};