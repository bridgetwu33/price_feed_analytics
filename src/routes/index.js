import express from 'express';
import priceRouter from './price';

const api = express.Router();
api.use('/price', priceRouter);

export default api;