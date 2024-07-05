const PDFDocument = require("pdfkit");
const Stream = require("stream");

const generatePDF = async (user) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" }); // size: [500, 500],
  const stream = new Stream.PassThrough();
  
  doc.pipe(stream);

  function writePDF() {
    doc.x = 150;
    doc
      .moveDown(5)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Anuradha Thota")
      .font("Helvetica")
      .text("Chief Executive Officer")
      .text("Blackbuck Engineers Pvt. Ltd.");
    doc.end();
  }

  writePDF();

  return stream;
};

async function generateAndUploadPDFs() {
    const pdfStream = await generatePDF(user);
    pdfStream.on('finish', () => console.log("**********************8",pdfStream.read));
    console.log(pdfStream);

    const uploadPromise = new Promise((resolve, reject) => {
        // console.log(pdfStream);        
        pdfStream.on('finish', () => console.log("finished finally"));
    });

    await uploadPromise;
    
}

const user = {
  name: "CHAITANYA HARSHAN. D",
  college: "Andhra University",
  roll_number: "321106614006",
  grade: "A",
  certificate_id: "3A787GH13",
  domain: "Full Stack Dev",
};
generateAndUploadPDFs();
// (async ()=>{
    
//     // const thing =  await generatePDF(user);
//     // thing.on('finish', ()=>console.log("-thing finished-"));
//     console.log("%%\n\n\nn\n\n");
//     // console.log(thing);

//     generateAndUploadPDFs();

// })();

