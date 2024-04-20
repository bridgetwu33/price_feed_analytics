const { logger } = require('../logger');
import { processAllChainLinkDatas } from '../routes/price/chainLinkHandler';
const setAsyncInterval = (fn, ms) => {
    fn().then(() => {
      setTimeout(() => setAsyncInterval(fn, ms), ms);
    });
};


const runChainLinkPriceData = async () => {
      setAsyncInterval(async () => {
        try {
           // Retrieve pending process summary data
          logger.info("--------------  run chainlink price scheduler------------------");
          await processAllChainLinkDatas('CHAINLINK_ETH_USD');
        } catch (err) {
          logger.error(`Error in scheduled initial Chainlink price Data process ${err}`);
        }
      }, 
      3600000);// Interval in milliseconds (e.g., 5000ms or 5 seconds)
  
   };

   module.exports = { runChainLinkPriceData }