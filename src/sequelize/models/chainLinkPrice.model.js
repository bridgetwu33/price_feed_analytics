const { DataTypes } = require('sequelize');

// We export a function that defines the model.
module.exports = (sequelize) => {
    sequelize.define("chainLinkPrice", {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      priceDate: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'price_date'
      },
      decimals: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      priceName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'price_name'
      },
      priceDesc: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'price_desc'
      },
      roundPhaseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'round_phaseId'
      },
      roundRoundId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'round_roundId'
      },
      roundAnswer: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'round_answer'
      },
      roundTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'round_timestamp'
      },
      roundDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'round_date'
      }
  }, {
    tableName: 'chain_link_price',
    timestamps: false
  });
};