// Importing necessary modules
const csv = require('csv-parser');
const fs = require('fs');

/**
 * Reads CSV data from a specified file and applies a function to each row.
 * @param {string} filePath - Path to the CSV file.
 * @param {Function} handleRowCallBack - Function to handle each row of data.
 */
// function readCSV(filePath, handleRowCallBack) {
//     // Create a readable stream from the specified CSV file
//     fs.createReadStream(filePath)
//         .pipe(csv({
//             bom: true  // This tells the csv-parser to handle the Byte Order Mark if present
//         }))
//         .on('data', handleRowCallBack)  // Apply the passed function to each row
//         .on('end', () => {
//             console.log('CSV file has been processed.');
//         })
//         .on('error', (err) => {
//             console.error('Error reading the CSV file:', err);
//         });
// }
function readCSV(filePath, handleRow) {
    let rowCounter = 0; 
    const promises = [];
    fs.createReadStream(filePath)
        .pipe(csv({ bom: true })) // Handle the BOM if present
        .on('data', (row) => {
            // Call the async handleRow function and store its promise
            rowCounter++;
            const processPromise = handleRow(row);
            promises.push(processPromise);
        })
        .on('end', async () => {
            await Promise.all(promises);
            console.log(`All rows have been processed. Total rows: ${rowCounter}`);
        })
        .on('error', (err) => {
            console.error('Error reading the CSV file:', err);
        });
}
function handleEachRow(saveFunction) {
    return async (row) => {
        const cleanRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
                  key.replace(/^\uFEFF/, '').replace(/^"|"$/g, '').trim(), // Remove BOM and trim whitespace
                    value
            ])
        );
        //console.log('Processing clean row:', cleanRow);
        try {
            const saveResult = await saveFunction(cleanRow);
            console.log(saveResult);
        } catch (error) {
            console.error(`Error saving row: ${JSON.stringify(row)}, Error: ${error}`);
        }
    };
}
// Export the function if it needs to be used in other parts of your application
module.exports = { readCSV, handleEachRow };