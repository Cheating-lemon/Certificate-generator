const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generateCertificate(user) {
  // Load the existing PDF template
  const templatePath = path.resolve(__dirname, "Certificate-Template.pdf");
  const existingPdfBytes = fs.readFileSync(templatePath);

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Define the positions and add the user data
  const drawText = (text, x, y, size = 12) => {
    firstPage.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // Retrieve page text and replace placeholders with actual data
//   let templateText = firstPage.getTextContent();

  // Define user data
  const replacements = {
    '<<Certificate ID>>': { text: user.certificateId, x: 120, y: 700 },
    '<<name>>': { text: user.name, x: 120, y: 650 },
    '<<regno>>': { text: user.rollNumber, x: 120, y: 600 },
    '<<collegename>>': { text: user.collegeName, x: 120, y: 550 },
    '<<university>>': { text: user.university, x: 120, y: 500 },
    '<<grade>>': { text: user.grade, x: 120, y: 450 },
  };
var templateText;
  // Replace placeholders with actual data
  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(key, "g");
    templateText = templateText.replace(regex, replacements[key]);
  });

  // Write the updated text back to the PDF
  drawText(templateText, 50, 500); // Adjust the position and size as needed

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();

  // trying to Save the certificate
  const newFileName = `certificate-${user.rollNumber}.pdf`; // Construct a filename with roll number
  const filePath = path.join(__dirname, "generated-certificates", newFileName); // Create a path within a 'generated-certificates' folder

  try {
    await fs.promises.writeFile(filePath, pdfBytes); // Use fs.promises.writeFile for asynchronous writing
    console.log(`Certificate saved successfully to: ${filePath}`);
  } catch (err) {
    console.error("Error saving certificate:", err);
  }
}

// Example user object
const user = {
  certificateId: "12345",
  name: "John Doe",
  rollNumber: "123456789",
  collegeName: "XYZ College",
  university: "ABC University",
  grade: "A",
};

// Generate the certificate and upload it
generateCertificate(user);
//   .then((url) => {
//     console.log("Certificate URL:", url);
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });
