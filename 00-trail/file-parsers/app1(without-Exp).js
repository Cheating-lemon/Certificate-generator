const fs = require('fs');
const { parse } = require('fast-csv');

// Replace 'path/to/your/file.csv' with the actual path to your CSV file
const csvFilePath = 'path/to/your/file.csv';

(async () => {
  try {
    const csvData = await fs.promises.readFile(csvFilePath, 'utf-8');

    parseString(csvData, { headers: true })
      .on('data', async (row) => {
        // Connect to your PostgreSQL database using 'pg'
        const client = new pg.Client({ /* Your connection details */ });
        await client.connect();

        // Prepare SQL statement with actual column names
        const insertQuery = `INSERT INTO users (name, email, roll_number, certificate_id, id, grade, domain) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [row['Name'], row['Email'], row['Roll Number'], row['Certificate'], row['Id'], row['Grade'], row['Domain']]; // Map row data to values array

        try {
          await client.query(insertQuery, values);
        } catch (error) {
          console.error('Error inserting data:', error);
        } finally {
          await client.end();
        }
        
      })
      .on('end', () => {
        console.log('CSV data processed and inserted into PostgreSQL');
      })
      .on('error', (error) => {
        console.error('Error parsing CSV data:', error);
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
})();
