const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('./Sample.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: ['name', 'email', 'roll_number', 'certificate_id', 'grade', 'domain'], range: 1 });
    console.log(jsonData);

} catch (err) {console.log(err.message);}