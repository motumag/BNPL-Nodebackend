const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const path = require("path");
exports.generatePdf = async function generateLoanAgreement(data) {
  // Read the loan agreement template text file
  const file_name = `Coop_loan_agreement_with_${data.first_name}_${data.last_name}_${data.loan_req_id}.pdf`;
  const filePath = path.join(
    __dirname,
    "../uploads/",
    "loan_agreement_template.txt"
  );
  const file_write_path = path.join(__dirname, "../uploads/" + file_name);
  const templateText = fs.readFileSync(filePath, "utf8");
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  // Set the font and font size for the content
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Adjust page height to accommodate the content
  const pageHeight = page.getHeight();
  const contentHeight = fontSize * (templateText.split("\n").length + 1); // Include extra line for spacing
  if (contentHeight > pageHeight) {
    page.setHeight(contentHeight + fontSize * 4); // Add extra padding at the bottom
  }

  var replacedText = templateText;
  Object.keys(data).forEach((key) => {
    const variableName = `{{${key}}}`;
    replacedText = replacedText.replaceAll(variableName, data[key]);
  });
  // Split the template text into lines
  const lines = replacedText.split("\n");

  // Set the initial y-coordinate for the content
  let y = page.getHeight() - fontSize * 2;

  // Write the lines of the template text onto the page
  lines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 10;
  });

  // Save the generated loan agreement as a PDF file
  const generatedBytes = await pdfDoc.save();
  fs.writeFileSync(file_write_path, generatedBytes);

  console.log("Loan agreement generated successfully.");
  console.log("File saved at: ", file_write_path);
  return file_write_path;
};
