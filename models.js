const { client } = require("./database");
const generatePDF = require("./certificate");
const AWS = require("aws-sdk");

const insertOrUpdateUser = async (user) => {
  const querySelect = "SELECT * FROM users WHERE roll_number = $1";
  const queryInsert = `
    INSERT INTO users (name, email, college, roll_number, certificate_id, grade, domain)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const queryUpdate = `
    UPDATE users SET name = $1, email = $2, college = $3, certificate_id = $5, grade = $6, domain = $7
    WHERE roll_number = $4
  `;
  const values = [
    user.name,
    user.email,
    user.college,
    user.roll_number,
    user.certificate_id,
    user.grade,
    user.domain,
  ];
  try {
    // console.log("bro--"+JSON.stringify(user));//========
    // console.log(querySelect+"\n~~~@@@@@@@@@@~~~\n"+user.roll_number);//=========
    const res = await client.query(querySelect, [user.roll_number]);
    if (res.rows.length > 0) {
      await client.query(queryUpdate, values);
      console.log(user.name, " was updated");
    } else {
      await client.query(queryInsert, values);
      console.log(user.name, " inserted successfully");
    }
  } catch (err) {
    console.error("Error inserting/updating user", err);
  }
};

const getAllUsers = async () => {
  const queryText = "SELECT * FROM users";
  try {
    const res = await client.query(queryText);
    return res.rows;
  } catch (err) {
    console.error("Error fetching users", err);
  }
};

const getUserCertificate = async (rollNumber) => {
  const queryText = "SELECT certificate FROM users WHERE roll_number = $1";
  try {
    const res = await client.query(queryText, [rollNumber]);
    if (res.rows.length > 0) {
      return res.rows[0].certificate;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching user certificate", err);
  }
};

const s3 = new AWS.S3();

async function uploadToS3(stream, rollNum) {
  const params = {
    Bucket: "bucket-name",
    Key: `certificates/${rollNum}.pdf`,
    Body: stream,
    ContentType: "application/pdf",
  };

  return s3.upload(params).promise();
}

// async function generateAndUploadPDFs() {
//   try {
//     const res = await client.query("SELECT * FROM users");
//     const users = res.rows;

//     for (const user of users) {
//       const pdfStream = await generatePDF(user);
//       const result = await uploadToS3(pdfStream, user.roll_number);
//       const s3Location = result.Location;

//       await client.query(
//         "UPDATE users SET certificate = $1 WHERE roll_number = $2",
//         [s3Location, user.roll_number]
//       );
//       console.log(
//         `PDF uploaded to S3 and database updated for user: ${user.roll_number}`
//       );
//     }
//   } catch (err) {
//     console.error("Error processing users:", err);
//   }
// }

async function generateAndUploadPDFs() {
  try {
    const res = await client.query("SELECT * FROM users WHERE certificate IS NULL");
    const users = res.rows;

    for (const user of users) {
      const pdfStream = await generatePDF(user);
      // console.log(typeof(pdfStream));

      // promise to handle stream events
      const uploadPromise = new Promise((resolve, reject) => {
      // console.log(pdfStream);        
        pdfStream.on('finish', async () => {
          
          try {
            const result = await uploadToS3(pdfStream, user.roll_number);
            const s3Location = result.Location;

            await client.query("UPDATE users SET certificate = $1 WHERE roll_number = $2",[s3Location, user.roll_number]);
            console.log(`PDF uploaded to S3 and database updated for user: ${user.roll_number}`);
            resolve();

          } catch (error) {
            console.error(`Error uploading PDF for user ${user.roll_number}:`,error);
            reject(error);
          }
        });

        pdfStream.on("error", (error) => {
          console.error("Error generating PDF:", error);
          reject(error);
        });
      });

      await uploadPromise;
    }
  } catch (err) {console.error("Error fetching users:", err);} 
}

module.exports = {
  insertOrUpdateUser,
  getAllUsers,
  getUserCertificate,
  generateAndUploadPDFs,
};
