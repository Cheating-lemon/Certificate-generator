const PDFDocument = require("pdfkit");
const fs = require("fs");
// const path = require("path");
const addTextbox = require("textbox-for-pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const Stream = require("stream");

const generatePDF = async (user) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" }); // size: [500, 500],
  const stream = new Stream.PassThrough();
  
  doc.pipe(stream);

  async function writePDF() {
    // font
    const fontBuffer = fs.readFileSync("fonts/Pacifico-Regular.ttf");
    doc.registerFont("pacifico", fontBuffer);

    const startX = doc.page.margins.left;
    const endX = doc.page.width - doc.page.margins.right;

    // Add image
    doc.image("images/bg.jpg", 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
      align: "center",
    });
    doc.image("images/apsche.png", 60, 50, { width: 50, height: 50 });
    doc.image("images/ap.png", 370, 50, { width: 50, height: 50 });
    doc.image("images/BBucks.png", 500, 50, { width: 130, height: 50 });
    doc.image("images/iidt.png", endX - 70, 50, { width: 70, height: 50 });
    // 2nd
    doc.image("images/qr.png", 70, 160, { width: 70, height: 70 });
    doc.image("images/gold_badge.png", endX - 70, 160, {width: 70,height: 90,});
    //3rd
    SVGtoPDF(doc,await fs.promises.readFile("images/bb_stamp.svg", "utf-8"),160,400,{ width: 1, height: 1 });
    SVGtoPDF(doc,await fs.promises.readFile("images/director_sign.svg", "utf-8"),450,420,{});
    SVGtoPDF(doc,await fs.promises.readFile("images/iidt_stamp.svg", "utf-8"),580,400,{});

    const textBox = [
      { text: "This is to certify that ", font: "Helvetica" },
      { text: `MrMs ${user.name},  `, font: "Helvetica-Bold" },
      { text: "with Roll No: ", font: "Helvetica" },
      { text: `${user.roll_number} `, font: "Helvetica-Bold" },
      { text: "from ", font: "Helvetica" },
      { text: `${user.college} `, font: "Helvetica-Bold" },
      {
        text: "has successfully completed the Internship on ",
        font: "Helvetica",
      },
      { text: `${user.domain} `, font: "Helvetica-Bold" },
      { text: "conducted by ", font: "Helvetica" },
      {
        text: "International Institute of Digital Technologies, ",
        font: "Helvetica-Bold",
      },
      { text: "the ", font: "Helvetica" },
      {
        text: "Knowledge Partner, Blackbuck Engineers ",
        font: "Helvetica-Bold",
      },
      { text: "and ", font: "Helvetica" },
      {
        text: "Andhra Pradesh State Council of Higher Education (APSCHE).",
        font: "Helvetica-Bold",
      },
      {
        text: "His/her performance in the Internship is ",
        font: "Helvetica",
        newLine: true,
      },
      { text: `"${user.grade}".`, font: "Helvetica-Bold" },
    ];

    doc
      .moveDown(4)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("ANDHRA PRADESH STATE COUNCIL OF HIGHER EDUCATION", {align: "center",})
      .font("Helvetica")
      .fontSize(13)
      .moveDown(0.3)
      .text("(A Statutory Body of the Government of Andhra Pradesh)", {align: "center",})
      .moveDown(1)
      .fontSize(13)
      .text("and", { align: "center" })
      .moveDown(1)
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("INTERNATIONAL INSTITUTE OF DIGITAL TECHNOLOGIES, TIRUPATI", {align: "center",})
      .font("Helvetica")
      .fontSize(14)
      .moveDown(0.3)
      .text("( IT E & C Department, Government of Andhra Pradesh)", {align: "center",})
      .moveDown(1)
      .fontSize(12)
      .font("Helvetica")
      .text(`Certificate ID: `, { align: "left", continued: true })
      .font("Helvetica-Bold")
      .text(`${user.certificate_id}`)
      .moveUp(0.5)
      .fontSize(24)
      .font("pacifico")
      .text("Certificate of Completion", { align: "center" })

      .moveDown(0.5);

    addTextbox(textBox, doc, doc.x, doc.y, endX - startX, {
      color: "black",
      fontSize: 11.5,
      lineHeight: 1.5,
      align: "center",
    });

    doc.moveDown(0);
    doc.x = startX;
    doc.x = 150;

    doc
      .moveDown(5)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Anuradha Thota")
      .font("Helvetica")
      .text("Chief Executive Officer")
      .text("Blackbuck Engineers Pvt. Ltd.");

    doc.x = 490;
    doc
      .moveUp(3)
      .font("Helvetica-Bold")
      .text("Dr. Sundar Balakrishna")
      .font("Helvetica")
      .text("Director General")
      .font("Helvetica-Bold")
      .text("International Institute of Digital Technologies");

    //footer
    doc.page.margins.bottom = 10;
    doc.x = startX;
    doc
      .moveDown(3)
      .text("Date: ", { continued: true })
      .font("Helvetica")
      .text("15/04/2024 ", { continued: true })
      .font("Helvetica-Bold")
      .text("Place: ", { continued: true })
      .font("Helvetica")
      .text("Tirupati");

    doc.end();
  }

  writePDF();
  return stream;
};

module.exports = generatePDF;
