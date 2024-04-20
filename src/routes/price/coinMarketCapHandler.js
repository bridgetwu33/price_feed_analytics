const { logger } = require('../../logger');
import { sequelize  } from '../../sequelize';
const { convertYYYYMMDDDateToInt, convertPriceToDecimal } = require('../../utils/appUtils');
const { readCSV, handleEachRow } = require('../../utils/csvUtils');
const { coinMarketCapEthPrice } = sequelize.models;

// Function to save each row
export async function saveRowToDatabase(row) {
  // Implement your database saving logic here
  await sequelize.models.coinMarketCapEthPrice.create({
    priceDate: convertYYYYMMDDDateToInt(row.Date),
    price: convertPriceToDecimal(row.AdjClose),
    open: convertPriceToDecimal(row.Open),
    high: convertPriceToDecimal(row.High),
    low: convertPriceToDecimal(row.Low),
    close: convertPriceToDecimal(row.Close),
    totalVolume: row.Volume
  });
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          // Simulating successful database save
          resolve(`Row saved: ${JSON.stringify(row.Date)}`);
      }, 1000); // simulate delay
  });
}

export const processAllCoinMarketCapEthUsdDatas = async () => {
    const filePath = './data/ETH-USD-CoinMarketCap-Data.csv';
    readCSV(filePath, handleEachRow(saveRowToDatabase));

    return {
      success: true,
      result: "",
      message: "Successfully processed all CoinMarketCap EthUsd records."
    };
}