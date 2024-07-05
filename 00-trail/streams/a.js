const { log } = require('console');
const PDFDocument = require('pdfkit');
const Stream = require('stream');

const generatePDF = (user) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  const stream = new Stream.PassThrough();

  doc.pipe(stream);

  async function writePDF() {
    doc.x = 150;
    doc
      .moveDown(5)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(user.name) // Assuming user object has name property
      .font("Helvetica")
      .text("Chief Executive Officer")
      .text("Blackbuck Engineers Pvt. Ltd.");
    doc.end();
  }

//   writePDF();
setTimeout(writePDF,3000);

  return stream;
};

async function generateAndUploadPDFs(user) {
  const pdfStream = generatePDF(user);
  console.log("~before");

  pdfStream.on('finish', () => console.log("*stream finished*"));
  console.log("~after");
  bro();
}
function bro(){
    console.log("whats up bro");
}

// Example usage
const user = {
  name: 'Anuradha Thota'
  // other user properties
};

// generateAndUploadPDFs(user);
console.log("Dman boi");
// generateAndUploadPDFs({name: "Likhit"});


function processUsers() {
    const arr = [{name:"likhit"},{name:"isaac"},{name:"chaitanya"}];
    for (const user of arr) {
        generateAndUploadPDFs(user);
    }
}

processUsers();