const { DataTypes } = require('sequelize');

// We export a function that defines the model.
module.exports = (sequelize) => {
    sequelize.define("coinMarketCapEthPrice", {
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
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      open: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      high: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      low: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      }, 
      close: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },   
      totalVolume: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'total_volume'
      },   
      changePercentage: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'change_percentage'
      }
  }, {
    tableName: 'coinmarketcap_eth_price',
    timestamps: false
  });
};