const { logger } = require('../../logger');
import axios from 'axios';
const { chainLinkETHUSDUrl, ethereumMainnetPK } = require('../../config');
import { sequelize  } from '../../sequelize';
const { convertToUnixTimestampOfDate } = require('../../utils/appUtils');
const { priceDataProcess } = sequelize.models;

// chainlink price query url
function generateChainLinkPriceUrl(date) {
  let dataRange = convertToUnixTimestampOfDate(date)
  return `${chainLinkETHUSDUrl}&startTimestamp=${dataRange.startOfDay}&endTimestamp=${dataRange.endOfDay}&chain=mainnet&rpcUrl=https://eth-mainnet.g.alchemy.com/v2/${ethereumMainnetPK}`;
}


export const processAllChainLinkDatas = async (type) => {

  let chainLinkDataProcessRecords = null;
  if(type==='CHAINLINK_ETH_USD') {
    chainLinkDataProcessRecords = await sequelize.models.priceDataProcess.findAll({
      where: {
        status: "Initial", 
        type: "CHAINLINK_ETH_USD"
      }
    });
  } 

  if(chainLinkDataProcessRecords === null) {
    throw new Error("chainLinkDataProcessRecords === null");
  }

  // Initialize an array to store date-process count pairs
  const processedCountsByDate = [];

  // Iterate through each priceDataProcess record
  for (const record of chainLinkDataProcessRecords) {
    // Process each record here
    logger.info("------------  process date: %s --------------", record.processDate);
    const day = record.processDate;

    // Fetch the processed count for the current date
    const savedRecordsCount = await getChainLinkPrice(type, day);
    // Store the date and its corresponding processed count in the array
    processedCountsByDate.push({ date: day, count: savedRecordsCount });

  }

  return {
    success: true,
    result: processedCountsByDate, // Return the array with date-process count pairs
    message: "Successfully processed all priceDataProcess records with status 'Initial'."
  };
}

export const getChainLinkPrice = async (priceName, day) => {
  try {
    const results = [];
    let savedRecordsCount = 0;
    // Mark it as pending process
    await priceDataProcess.update({ status: 'Pending' }, { where: { processDate: day, type: priceName} });
    logger.info("fetching ETH/USD Chainlink Price data at: %s", day);
    const priceUrl = generateChainLinkPriceUrl(day);
    await axios.get(priceUrl) // Wait for axios request to complete
    .then(async (response) => { // Convert the function to async
      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        const rounds = data.rounds;
        logger.info("get the data ETH/USD Chainlink Price data at: %s, size: %s ", day, rounds.length);
        // Loop through rounds array
        for (const round of rounds) {
          const roundDate = new Date(round.date);
          // Use await inside the loop
          await sequelize.models.chainLinkPrice.create({
            priceDate: day,
            decimals: data.decimals,
            priceName: priceName,
            priceDesc: data.description,
            roundPhaseId: round.phaseId,
            roundRoundId: round.roundId,
            roundAnswer: round.answer,
            roundTimestamp: round.timestamp,
            roundDate: roundDate
          });
          savedRecordsCount++;
        }
        // Mark it as complete after all process are done
        await priceDataProcess.update({ status: 'Complete' }, { where: { processDate: day, type: priceName } });
        logger.info("saved chainlink price (ETH/USD) process date at: %s, savedRecordsCount: %s", day, savedRecordsCount);
      } else {
        logger.info("Can't fetch ETH/USD Chainlink Price data at:", response);
      }
    })
    .catch((error) => {
      logger.info("Error fetching ETH/USD Chainlink Price data:", error);
    });

    return savedRecordsCount;
  } catch (error) {
    logger.error('Error executing query generateChainLinkPriceUrl:', error);
    await priceDataProcess.update({ status: 'Complete' }, { where: { processDate: updatedAt, type: categoryReq } });
    // throw error; // Rethrow the error to be handled by the caller
  }
};
