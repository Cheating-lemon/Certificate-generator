const express = require('express');
const xlsx = require('xlsx');
const { connectDB, disconnectDB, createUsersTable } = require('./database');
const { insertOrUpdateUser, getAllUsers, getUserCertificate, generateAndUploadPDFs } = require('./models');

const app = express();
const port = 3000;

app.use(express.json());

// Initializing the database table
const initializeDB = async () => {
  await connectDB();
  await createUsersTable();
};

initializeDB();

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Endpoint to fetch user certificate by roll number
app.get('/certificate/:rollNumber', async (req, res) => {
  const { rollNumber } = req.params;
  try {
    const certificate = await getUserCertificate(rollNumber);
    if (certificate) {
      res.send(certificate);
    } else {
      res.send('User does not exist');
    }
  } catch (err) {
    res.status(500).send('Error fetching user certificate');
  }
});

// to fetch and post EXEL data to db & then to s3 and then updating the certificate link
app.post('/upload', (req,res) => {
  const jsonData = [];
  try {
    const workbook = xlsx.readFile('./Sample.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: ['name','email','roll_number','certificate_id','grade','domain','college'], range: 1});
    jsonData.forEach(async (user) => {
      try {
        await insertOrUpdateUser(user);
      } catch (error) {
        console.log("Error inserting/updating user", error);
      }
    });


    // Creating Certificate & Uploading to AWS
    generateAndUploadPDFs()
    .then(()=>console.log('All PDFs are generated and uplaoded to S3 successfully.'))
    .catch(err => console.log('Error in generating or uploading: ', err));

    res.send("~ All Users are uploaded Successfully.");

  } catch (err) {
    console.log("Error reading data.", err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
