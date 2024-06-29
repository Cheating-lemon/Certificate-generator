const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Certificate } = require('crypto');

const generatePDF = async (user) => {
    const doc = new PDFDocument({size: 'A4', layout: 'landscape'}); // size: [500, 500],

    const pdfPath = path.join(__dirname, `${user.name}.pdf`);
    const stream = fs.createWriteStream(pdfPath);
  
    doc.pipe(stream);

    const startX = doc.page.margins.left;
    const endX = doc.page.width - doc.page.margins.right;

    // Add image
    doc.image("images/bg.jpg",0,0, {width: doc.page.width, height: doc.page.height, align: 'center'});
    doc.image("images/apsche.png",60,50, {width: 50, height: 50});
    doc.image("images/ap.png", 370, 50, { width: 50, height: 50});
    doc.image("images/BBucks.png", 500, 50, { width: 130, height: 50});
    doc.image("images/iidt.png", endX-70, 50, { width: 70, height: 50});
    // 2nd
    doc.image("images/qr.png",70,160, {width: 70, height: 70});
    doc.image("images/gold_badge.png",endX-70,160, {width: 70, height: 90});

    // Add line
    // doc.moveDown(4) // Move down to create some space between image and line
    //   .moveTo(startX, doc.y) // Move to the leftmost position of the current line, considering the margin
    //   .lineTo(endX, doc.y) // Draw a line to the rightmost position of the page, considering the margin
    //   .strokeColor('grey') // Set the line color
    //   .stroke(); // Stroke the line
  
  
    // Add styling and text content
    doc.moveDown(4)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('ANDHRA PRADESH STATE COUNCIL OF HIGHER EDUCATION', { align: 'center'})
      .font('Helvetica')
      .fontSize(13)
      .moveDown(0.3)
      .text('(A Statutory Body of the Government of Andhra Pradesh)', {align: 'center'})
      .moveDown(1)
      .fontSize(13)
      .text('and',{align: 'center'})
      .moveDown(1)
      .fontSize(13)
      .font('Helvetica-Bold')
      .text('INTERNATIONAL INSTITUTE OF DIGITAL TECHNOLOGIES, TIRUPATI', { align: 'center'})
      .font('Helvetica')
      .fontSize(14)
      .moveDown(0.3)
      .text('( IT E & C Department, Government of Andhra Pradesh)', {align: 'center'})
      .moveDown(1)
      .fontSize(12)
      .font('Helvetica')
      .text(`Certificate ID: `, { align: 'left', continued:true })
      .font('Helvetica-Bold')
      .text(`${user.certificate_id}`)
      .moveDown(1)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Certificate of Completion', { align: 'center'})


      .moveDown(1)
      
      .fontSize(12)
      .font('Helvetica')
      .text('This is to certify that ', { continued: true,  })
      .font('Helvetica-Bold')
      .text(`Mr/Ms ${user.name},  `, { continued: true,  })
      .font('Helvetica')
      .text(`with Roll No: `, { continued: true,  })
      .font('Helvetica-Bold')
      .text(`${user.roll_number}  `, {continued: true, })
      .font('Helvetica')
      .text('from ', { continued: true,  })
      .font('Helvetica-Bold')
      .text(`${user.college} `, { continued: true,  })
      .font('Helvetica')
      .text(', has successfully completed the Internship on  ', { continued: true,  })
      .font('Helvetica-Bold')
      .text(`${user.domain} `, {continued: true, })
      .font('Helvetica')
      .text('conducted by ', { continued: true,  })
      .font('Helvetica-Bold')
      .text('International Institute of Digital Technologies, ', { continued: true,  })
      .font('Helvetica')
      .text('the ', { continued: true,  })
      .font('Helvetica-Bold')
      .text('Knowledge Partner, Blackbuck Engineers ', { continued: true,  })
      .font('Helvetica')
      .text('and ', { continued: true,  })
      .font('Helvetica-Bold')
      .text('Andhra Pradesh State Council of Higher Education (APSCHE).', { continued: false })

      .moveDown(0.5)
      .font('Helvetica')
      .text('His/her performance in the Internship is ', { continued: true, align:'center'})
      .font('Helvetica-Bold')
      .text(`       "${user.grade}".`, { continued: false ,})


      
      // .font('Helvetica')
      // .moveDown(0.5)
      // .font('Helvetica')
      // .text('This is to certify that ', { continued: true })
      // .text('${interested_stream}', { continued: false })
      // .moveDown(0.5)
      // .text('In collaboration with ', { continued: true })
      // .font('Helvetica-Bold')
      // .text('Blackbuck Engineers', { continued: true })
      // .font('Helvetica')
      // .text(', our esteemed ', { continued: true })
      // .font('Helvetica-Bold')
      // .text('Industry/Knowledge Partner', { continued: true })
      // .font('Helvetica')
      // .text(', we have developed a program that is both rigorous and highly relevant to the industry. uuuuuuuuuuuuuuuuuuuuu iiiiiiiiii yyyyyy', { continued: true, align: 'center' })
      // .moveDown(0.5)
      // .text('We eagerly anticipate a mutually beneficial and inspiring association with you throughout the duration of the program.', { continued: true})
      // .moveDown(1)
      // .text('Best Regards,', { align: 'left' })
      // .text('IIDT Team', { align: 'left' })
      // .moveDown(1)
      // .font('Helvetica-Oblique')
      // .text('If you have any questions, please feel free to contact us at ', { align: 'left', continued: true })
      // .font('Helvetica')
      // .fillColor('blue')
      // .text('adminmanager-iidt@ap.gov.in', { link: 'mailto:adminmanager-iidt@ap.gov.in', underline: true , continued: true})
      // .text(' or ', { continued: true, fillColor: 'black' })
      // .text('iidtinternships@blackbucks.me', { link: 'mailto:iidtinternships@blackbucks.me', underline: true, continued: false })
      // .font('Helvetica')
      // .moveDown(3) // Move down to create some space between image and line
      // .moveTo(startX, doc.y) // Move to the leftmost position of the current line, considering the margin
      // .lineTo(endX, doc.y) // Draw a line to the rightmost position of the page, considering the margin
      // .strokeColor('grey') // Set the line color
      // .stroke()// Stroke the line
      // .moveDown(2)
      // .fillColor('black')
      // .text('IIDT, New Airport Road, G. Palem, Renigunta, Tirupati, Pin: 517520.',{ align: 'center'})
      // .moveDown(0.5)
      // .fillColor('blue')
      // .text('Website: https://iidt.ap.gov.in  Email: iidt.tpti@gmail.com', { align: 'center', link: 'https://iidt.ap.gov.in', underline: true });
      doc.end();
  
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log('PDF generated successfully');
        resolve(pdfPath);
      });
  
      stream.on('error', (error) => {
        console.error('Error generating PDF:', error);
        reject(error);
      });
    });
  };

const user = {
  name: 'CHAITANYA HARSHAN. D',
  college: 'Andhra University',
  roll_number: "321106614006",
  grade: 'A',
  certificate_id: "3A787GH13",
  domain: "Full Stack Dev"
}
generatePDF(user);