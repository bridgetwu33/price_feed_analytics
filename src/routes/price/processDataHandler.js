const { logger } = require('../../logger');
import { sequelize  } from '../../sequelize';
const { getDateRange } = require('../../utils/appUtils');
const { priceDataProcess } = sequelize.models;

export const prepareProcessData = async (from, to, includeFromDate, type) => {
    try {
      const days = getDateRange(from, to, includeFromDate);
      logger.info("passing days: %s", days);
      let sqlQuery = `
        SELECT process_date
        FROM price_data_process
        WHERE process_date IN (${days.map(() => '?').join(', ')}) and type="${type}"
      `;
      // Replace the placeholders with actual values
      for (let i = 0; i < days.length; i++) {
        sqlQuery = sqlQuery.replace('?', days[i]);
      }
      const results = await sequelize.query(sqlQuery, {
        type: sequelize.QueryTypes.SELECT
      });
   
      if (!results || results.length === 0) {
        logger.info('No results found in the database.');
        const res = await createProcessRecord(days, type);
        return res;
      }
      logger.info('Dates found in the database: : %s', results);
      // Ensure that results is an array of dates
      const existingDates = results.map(result => result.process_date);
      // Find the dates that are not in the database
      const remainingDates = days.filter(date => !existingDates.includes(date));
      logger.info('Remaining dates to be inserted: : %s', remainingDates);
      const res = await createProcessRecord(remainingDates);
      return res;
  
    } catch (error) {
      logger.error('Error executing prepareProcessData:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
  
  export  const createProcessRecord = async(days, type) => {
    try {
      const results = [];
      for (const date of days) {
        // Assuming process.create() returns a Promise
        try {
          const result = await priceDataProcess.create({
            type: type,
            processDate: date,
            status: 'Initial'
            // Other necessary properties...
          });
  
          logger.info(`create priceDataProcess date ${date}`);
          // Add object with id and date to the results array
          results.push({ id: result.id, date: result.processDate }); 
        } catch (error) {
          // Log errors for individual dates
          logger.error(`Error priceDataProcess date ${date}:`, error);
        }
      }
  
      return results; // Return the array of objects containing id and date
    } catch (error) {
      logger.error(`Error processing date ${date}:`, error);
      throw error;
    }
  }