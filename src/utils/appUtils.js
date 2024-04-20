const moment = require('moment');

export function getCurrentDateAsNumber() {
    // Get the current date using Moment.js
    const currentDate = moment();
  
    // Format the date as YYYYMMDD
    const formattedDate = currentDate.format('YYYYMMDD');
  
    // Return the formatted date as a number
    return parseInt(formattedDate);
}

export function getNDates(date, n, includeFirstDate = false) {
    // Parse the provided date using Moment.js
    let startDate = moment(date, 'YYYYMMDD');

    // If includeCurrentDate is false, decrement the startDate by 1 day
    if (!includeFirstDate) {
      startDate = startDate.subtract(1, 'day');
    }

    // Create an array to store the result
    const dateRange = [];
  
    // Add the provided date to the result
    dateRange.push(parseInt(startDate.format('YYYYMMDD')));
  
    // Calculate the date range for the past n-1 days
    for (let i = 1; i < n; i++) {
      const previousDate = startDate.clone().subtract(i, 'days');
      dateRange.push(parseInt(previousDate.format('YYYYMMDD')));
    }
    // Return the date range array
    return dateRange;
}

//add docs
export function getDateRange(fromDate, toDate, includeFromDate = false) {
  // Parse the provided dates using Moment.js
  let startDate = moment(fromDate, 'YYYYMMDD');
  const endDate = moment(toDate, 'YYYYMMDD');

  // If includeFromDate is false, increment the startDate by 1 day
  if (!includeFromDate) {
      startDate = startDate.add(1, 'day');
  }

  // Create an array to store the result
  const dateRange = [];

  // Calculate the date range for the days between startDate and endDate
  while (startDate.isSameOrBefore(endDate)) {
      dateRange.push(parseInt(startDate.format('YYYYMMDD')));
      startDate.add(1, 'day');
  }

  // Return the date range array
  return dateRange;
}



// Function to convert YYYYMMDD to Unix timestamp with start of day
export function convertToUnixTimestampOfDate(dateString) {
  // Parse the date string using moment
  const date = moment(dateString, 'YYYYMMDD');
  
  // Calculate the Unix timestamp for the beginning of the date (start of day)
  const startOfDayUnixTimestamp = date.startOf('day').unix();

  // Calculate the Unix timestamp for the end of the date (end of day)
  const endOfDayUnixTimestamp = date.endOf('day').unix();


  // Return an object containing both timestamps
  return {
      startOfDay: startOfDayUnixTimestamp,
      endOfDay: endOfDayUnixTimestamp
  };
}
export function convertMMDDYYYYDateToInt(dateString) {
  // Parse the date using the input format
  const date = moment(dateString, "MM/DD/YYYY");
  
  // Format the date as 'YYYYMMDD'
  const formattedDateString = date.format('YYYYMMDD');
  
  // Convert the formatted date string to an integer
  return parseInt(formattedDateString, 10);
}

export function convertYYYYMMDDDateToInt(dateString) {
  // Parse the date using the input format
  const date = moment(dateString, "YYYY-MM-DD");
  
  // Format the date as 'YYYYMMDD'
  const formattedDateString = date.format('YYYYMMDD');
  
  // Convert the formatted date string to an integer
  return parseInt(formattedDateString, 10);
}
export function convertUTCDateToInt(dateString) {
  // Parse the date using Moment.js
  const formattedDate = moment(dateString, "YYYY-MM-DD HH:mm:ss UTC").format('YYYYMMDD');
  // Convert the formatted date string to an integer
  return parseInt(formattedDate, 10);
}
export function convertPriceToDecimal(priceString) {
  // Remove commas and other non-numeric characters (except the decimal point)
  const cleanedPrice = priceString.replace(/,/g, '');
  // Convert the cleaned string to a float
  const priceFloat = parseFloat(cleanedPrice);
  // format it to two decimal places using toFixed, though
  // this returns a string and should be used only if you need to verify format or for further string manipulation
  const formattedPrice = priceFloat.toFixed(2);

  return formattedPrice;  // Return as a float, you can also return formattedPrice if a string is preferable
}