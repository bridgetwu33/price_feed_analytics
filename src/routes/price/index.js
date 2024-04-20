import express from 'express';
const priceRouter = express.Router();
import {processAllChainLinkDatas } from './chainLinkHandler';
import {processAllBinanceEthUsdDatas } from './binanceHandler';
import {processAllCoinMarketCapEthUsdDatas } from './coinMarketCapHandler';
import {processAllCoinGeckoEthUsdDatas } from './coinGeckoHandler';
import { prepareProcessData} from './processDataHandler';
/**
 * Handle an HTTP GET request to retrieve and save chainlink price details.
 *
 * @function
 * @async
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object.
 * @returns {Promise<void>} - Sends a JSON response with process details.
 */
priceRouter.post('/processAllChainLinkDatas', async (req, res) => {
   const { type } = req.body;
   const result = await processAllChainLinkDatas(type);
   // Respond with success message and fetched result
   res.status(200).json({
       Success: true,
       message: "Success",
       result: result
   });
});

/**
 * Handle an HTTP GET request to retrieve and save Binance price details.
 *
 * @function
 * @async
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object.
 * @returns {Promise<void>} - Sends a JSON response with process details.
 */
priceRouter.post('/processAllBinanceDatas', async (req, res) => {
    const { type } = req.body;
    const result = await processAllBinanceEthUsdDatas();
    // Respond with success message and fetched result
    res.status(200).json({
        Success: true,
        message: "Success",
        result: result
    });
 });
 /**
 * Handle an HTTP GET request to retrieve and save CoinMarketCap price details.
 *
 * @function
 * @async
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object.
 * @returns {Promise<void>} - Sends a JSON response with process details.
 */
priceRouter.post('/processAllCoinMarketCapDatas', async (req, res) => {
    const { type } = req.body;
    const result = await processAllCoinMarketCapEthUsdDatas();
    // Respond with success message and fetched result
    res.status(200).json({
        Success: true,
        message: "Success",
        result: result
    });
 });
 /**
 * Handle an HTTP GET request to retrieve and save CoinGecko price details.
 *
 * @function
 * @async
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object.
 * @returns {Promise<void>} - Sends a JSON response with process details.
 */
priceRouter.post('/processAllCoinGeckoDatas', async (req, res) => {
    const { type } = req.body;
    const result = await processAllCoinGeckoEthUsdDatas();
    // Respond with success message and fetched result
    res.status(200).json({
        Success: true,
        message: "Success",
        result: result
    });
 });
/**
 * Handle an HTTP GET request to prepare price date details.
 *
 * @function
 * @async
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object.
 * @returns {Promise<void>} - Sends a JSON response with process details.
 */
priceRouter.post('/prepareProcessData', async (req, res) => {
    const { from, to, includeFromDate, type  } = req.body;
     // Call the 'findProcessData' function to fetch process data.
    const result = await prepareProcessData(from, to, includeFromDate, type);

    res.status(200).json(({
        Success: true,
        message: "Success",
        result: result
    }));
});

export default priceRouter;