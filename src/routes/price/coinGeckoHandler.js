const { logger } = require('../../logger');
import { sequelize  } from '../../sequelize';
const { convertUTCDateToInt, convertPriceToDecimal } = require('../../utils/appUtils');
const { readCSV, handleEachRow } = require('../../utils/csvUtils');
const { coinGeckoEthPrice } = sequelize.models;

// Function to save each row
export async function saveRowToDatabase(row) {
  // Implement your database saving logic here
  await sequelize.models.coinGeckoEthPrice.create({
    priceDate: convertUTCDateToInt(row.snapped_at),
    price: convertPriceToDecimal(row.price),
    marketCap: convertPriceToDecimal(row.market_cap),
    totalVolume: row.total_volume
  });
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          // Simulating successful database save
          resolve(`Row saved: ${JSON.stringify(row.snapped_at)}`);
      }, 1000); // simulate delay
  });
}

export const processAllCoinGeckoEthUsdDatas = async () => {
    const filePath = './data/ETH-USD-Coingecko-Data.csv';
    readCSV(filePath, handleEachRow(saveRowToDatabase));

    return {
      success: true,
      result: "",
      message: "Successfully processed all CoinGecko EthUsd records."
    };
}