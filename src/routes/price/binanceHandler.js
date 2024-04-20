const { logger } = require('../../logger');
import { sequelize  } from '../../sequelize';
const { convertMMDDYYYYDateToInt, convertPriceToDecimal } = require('../../utils/appUtils');
const { readCSV, handleEachRow } = require('../../utils/csvUtils');
const { binanceEthPrice } = sequelize.models;

// Function to save each row
export async function saveRowToDatabase(row) {
  // Implement your database saving logic here
  await sequelize.models.binanceEthPrice.create({
    priceDate: convertMMDDYYYYDateToInt(row.Date),
    price: convertPriceToDecimal(row.Price),
    open: convertPriceToDecimal(row.Open),
    high: convertPriceToDecimal(row.High),
    low: convertPriceToDecimal(row.Low),
    totalVolume: row.Vol,
    changePercentage: row.Change
  });
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          // Simulating successful database save
          resolve(`Row saved: ${JSON.stringify(row.Date)}`);
      }, 1000); // simulate delay
  });
}

export const processAllBinanceEthUsdDatas = async () => {
    const filePath = './data/ETH_USD-Binance-Data.csv';
    readCSV(filePath, handleEachRow(saveRowToDatabase));

    return {
      success: true,
      result: "",
      message: "Successfully processed all BinanceEthUsd records."
    };
}