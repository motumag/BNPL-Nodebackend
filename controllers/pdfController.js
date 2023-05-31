const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generatePDF(req, res) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the document
    const page = pdfDoc.addPage();

    // Set the font and font size for the title
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.setFont(titleFont);
    page.setFontSize(32);

    // Add the title with "Loan Agreement" to the page
    page.drawText("Loan Agreement", {
      x: 50,
      y: 700,
      color: rgb(0, 0, 0),
      underline: true,
    });

    // Set the font and font size for the body text
    const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(bodyFont);
    page.setFontSize(12);

    // Add the description of the sample agreement to the page
    const description =
      'This Loan Agreement ("Agreement") is entered into between Cooperative Bank of Oromia and Motuma Gishu on date 05/31/2023.\n' +
      "Loan Amount: The Bank agrees to provide the Merchant with a loan in the amount of 1,000,000 ETB (one million Birr), to be disbursed in a lump sum.\n" +
      "Loan Purpose: The loan shall be used by the Merchant for trade, in accordance with the terms and conditions of this Agreement.\n" +
      "Loan Period: The loan shall have a duration of one year, starting from the date of disbursement.\n" +
      "Loan Interest: The loan shall accrue interest at the rate of 2% per annum, calculated on a monthly basis, based on the outstanding balance.\n" +
      "Repayment: The Merchant agrees to repay the loan in annual installments of 10 Installment Amount, which includes both principal and interest. The first repayment installment shall be due on [Specify Due Date]. The total repayment amount over the loan period, including principal and interest, is estimated to be [Total Repayment Amount].\n" +
      "Penalty: In the event of late payment or default on any installment, the Merchant shall be liable to pay a penalty fee of [Specify Penalty Amount] or [Specify Penalty Percentage]% of the overdue amount, whichever is higher.\n" +
      "Default and Remedies: In the event of default or breach of any terms and conditions of this Agreement, the Bank shall have the right to take appropriate legal action and enforce any remedies available under applicable laws.\n" +
      "Contact Information:\n" +
      "Bank: Cooperative Bank of Oromia\n" +
      "Address: Bole, Addis Ababa, Ethiopia\n" +
      "Contact Person: motumag@gmail.com\n" +
      "Contact Number: 09589745852\n" +
      "Merchant:\n" +
      "Name: Motuma Momo\n" +
      "Address: Addis Ababa, Ethiopia\n" +
      "Contact Number: 09589745852\n" +
      "Governing Law and Jurisdiction: This Agreement shall be governed by and construed in accordance with the laws of [Specify Jurisdiction]. Any disputes arising from or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of [Specify Jurisdiction].\n" +
      "By signing below, both the Bank and the Merchant acknowledge that they have read and understood the terms and conditions of this Loan Agreement and agree to be bound by them.\n" +
      "Bank: __cooperativeBank_ Date: 0531/2023\n" +
      "Merchant: Motuma Gishu Date: 0531/2023";

    const textWidth = 500;
    const lineHeight = 15;
    const textMargin = 10;
    const textPadding = 5;

    const descriptionLines = description.split("\n");
    let currentY = 650;

    for (let line of descriptionLines) {
      const textOptions = {
        x: 50,
        y: currentY,
        width: textWidth - textPadding * 2,
        height: lineHeight,
        color: rgb(0, 0, 0),
        align: "right", // Align the text to the right
      };

      page.drawText(line, textOptions);
      currentY -= lineHeight + textMargin;

      // Check if the next line exceeds the page height
      if (currentY <= 50) {
        // Add a new page
        const newPage = pdfDoc.addPage();
        currentY = newPage.getHeight() - 50;
        page.drawText(line, { ...textOptions, y: currentY });
        currentY -= lineHeight + textMargin;
        page = newPage;
      }
    }

    // Serialize the PDF document to a Uint8Array
    const pdfBytes = await pdfDoc.save();

    // Create the 'pdfs' folder if it doesn't exist
    const folderPath = path.join(__dirname, "pdfs");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Generate a unique filename for the PDF
    const timestamp = Date.now();
    const pdfPath = path.join(folderPath, `output_${timestamp}.pdf`);

    // Save the PDF to the specified path
    fs.writeFileSync(pdfPath, pdfBytes);

    res.send("PDF saved successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
}

module.exports = {
  generatePDF,
};
