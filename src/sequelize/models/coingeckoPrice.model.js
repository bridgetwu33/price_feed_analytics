const { DataTypes } = require('sequelize');

// We export a function that defines the model.
module.exports = (sequelize) => {
    sequelize.define("coinGeckoEthPrice", {
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
      marketCap: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'market_cap'
      },
      totalVolume: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'total_volume'
      },  

  }, {
    tableName: 'coingecko_eth_price',
    timestamps: false
  });
};