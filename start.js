// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  presets: ['@babel/preset-env'],
});

// Import the rest of our application.
module.exports = require('./src/server.js');
