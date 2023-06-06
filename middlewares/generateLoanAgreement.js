const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const path = require('path');
exports.generatePdf=async function generateLoanAgreement(data) {
  // Read the loan agreement template text file
  const file_name = `Coop_loan_agreement_with_${data.first_name}_${data.last_name}_${data.loan_id}.pdf`;
  const filePath = path.join(__dirname, '../uploads/', 'loan_agreement_template.txt');
  const file_write_path = path.join(__dirname, '../uploads/'+file_name);
  const templateText = fs.readFileSync(filePath, 'utf8');
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  // Set the font and font size for the content
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Split the template text into lines
  const lines = templateText.split('\n');

  // Set the initial y-coordinate for the content
  let y = page.getHeight() - fontSize - 50;

  // Write the lines of the template text onto the page
  lines.forEach(line => {
    page.drawText(line, { x: 50, y, font, size: fontSize });
    y -= fontSize + 10;
  });

  // Save the generated loan agreement as a PDF file
  const generatedBytes = await pdfDoc.save();
  fs.writeFileSync(file_write_path, generatedBytes);

  console.log('Loan agreement generated successfully.');
  return true;
}

// // Example usage
// const loanData = {
//   customerName: 'John Doe',
//   loanAmount: '$10,000',
//   interestRate: '5%',
//   loanTerm: '2 years',
// };

// generateLoanAgreement(loanData);
