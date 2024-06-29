const fs = require('fs');
const csv = require('csv-parser');

const results = [];
fs.createReadStream('./users.csv')
  .pipe(csv({ headers: ['name','email','roll_number','certificate_id','grade','domain'], skipLines: 1}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });


// app.post('/upload', (req, res) => {
//   const results = [];
//   fs.createReadStream('./users.csv')
//     .pipe(csv({ headers: ['name','email','roll_number','certificate_id','grade','domain'], skipLines: 1}))
//     .on('data', (data) => results.push(data))
//     .on('end', async () => {
//       for (const user of results) {
//         try {
//           await insertOrUpdateUser(user);
//         } catch (err) {
//           console.error("Error inserting/updating user", err);
//         }
//       }
//       res.send('CSV data uploaded successfully');
//     });
// });