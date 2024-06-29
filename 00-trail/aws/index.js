const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { PassThrough } = require('stream');
const { extname } = require('path');

async function uploadPdfToS3(user, generatePDF, bucketName, s3PathPrefix) {
  // Create an S3 client with your credentials
  const s3 = new S3Client({ region: "<your-s3-region>" }); // Replace with your region

  const pdfData = new PassThrough(); // Create a stream for the PDF data

  try {
    // Generate the PDF using your generatePDF function
    await generatePDF(user, pdfData);

    // Extract the file extension for the generated PDF
    const fileExtension = extname(user.certificate_id + '.pdf'); // Use certificate_id for uniqueness

    // Construct the S3 object key (file path) based on s3PathPrefix
    const s3ObjectKey = `${s3PathPrefix}/${user.certificate_id}${fileExtension}`;

    // Upload the PDF to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3ObjectKey,
      Body: pdfData
    });

    await s3.send(uploadCommand);

    // Return the S3 file path (optional)
    return `s3://${bucketName}/${s3ObjectKey}`;
  } catch (error) {
    console.error("Error uploading PDF to S3:", error);
    throw error; // Re-throw the error for handling in the caller
  } finally {
    // Ensure the stream is closed even if there are errors
    pdfData.end();
  }
}

// Example usage (assuming your generatePDF function is defined)
const user = {
  name: "CHAITANYA HARSHAN. D",
  college: "Andhra University",
  roll_number: "321106614006",
  grade: "A",
  certificate_id: "3A787GH13",
  domain: "Full Stack Dev",
};

(async () => {
  try {
    const s3FilePath = await uploadPdfToS3(user, generatePDF, "<your-bucket-name>", "certificates/");
    console.log("PDF uploaded to S3:", s3FilePath); // Optional: Log the S3 file path
  } catch (error) {
    console.error("Error uploading PDF:", error);
  }
})();
