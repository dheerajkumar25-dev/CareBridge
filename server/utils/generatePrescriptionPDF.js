// generatePrescriptionPDF.js
// Builds a simple PDF prescription document using PDFKit and streams it
// straight to the HTTP response - no temp file is written to disk.

const PDFDocument = require("pdfkit");

function generatePrescriptionPDF(res, { doctorName, patientName, date, medicines, advice }) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=prescription.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("CareBridge - Prescription", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Doctor: ${doctorName}`);
  doc.text(`Patient: ${patientName}`);
  doc.text(`Date: ${date}`);
  doc.moveDown();

  doc.fontSize(14).text("Medicines", { underline: true });
  medicines.forEach((med, i) => {
    const timing = [med.morning ? "Morning" : null, med.night ? "Night" : null]
      .filter(Boolean)
      .join(" & ");
    doc.fontSize(12).text(`${i + 1}. ${med.name} - ${med.dosage} (${timing}) for ${med.duration}`);
  });

  if (advice) {
    doc.moveDown();
    doc.fontSize(14).text("Advice", { underline: true });
    doc.fontSize(12).text(advice);
  }

  doc.end();
}

module.exports = generatePrescriptionPDF;
