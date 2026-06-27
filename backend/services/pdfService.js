import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const gold = '#C99B3F';
    const dark = '#141414';
    const gray = '#666666';

    // Header
    doc.rect(0, 0, doc.page.width, 100).fill(dark);
    doc.fillColor(gold).font('Helvetica-Bold').fontSize(28).text('SHIVAM', 40, 30);
    doc.fillColor('#FFFFFF').font('Helvetica').fontSize(11).text('RESTAURANT & RESORT', 40, 62);
    doc.fillColor(gold).fontSize(9).text('Jodhpur Road, Ghumti, Pali, Rajasthan', 40, 78);

    doc.fillColor('#FFFFFF').fontSize(9).text(`Invoice #${invoice.invoiceNumber}`, 380, 35, { align: 'right', width: 175 });
    doc.fillColor(gold).text(new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 380, 52, { align: 'right', width: 175 });

    // Customer & table info
    doc.fillColor(dark).font('Helvetica-Bold').fontSize(11).text('BILL TO', 40, 120);
    doc.moveTo(40, 135).lineTo(200, 135).lineWidth(1).strokeColor(gold).stroke();
    doc.fillColor(dark).font('Helvetica').fontSize(10)
      .text(invoice.customerName, 40, 142)
      .text(`Phone: ${invoice.customerPhone}`, 40, 158);

    if (invoice.tableNumber) {
      doc.fillColor(dark).font('Helvetica-Bold').fontSize(11).text('TABLE INFO', 320, 120);
      doc.moveTo(320, 135).lineTo(555, 135).lineWidth(1).strokeColor(gold).stroke();
      doc.fillColor(dark).font('Helvetica').fontSize(10)
        .text(`Table Number: ${invoice.tableNumber}`, 320, 142);
    }

    // Items table header
    const tableTop = 200;
    doc.rect(40, tableTop, 515, 24).fill(dark);
    doc.fillColor(gold).font('Helvetica-Bold').fontSize(9)
      .text('ITEM', 50, tableTop + 8)
      .text('QTY', 330, tableTop + 8, { width: 50, align: 'center' })
      .text('PRICE', 390, tableTop + 8, { width: 70, align: 'right' })
      .text('TOTAL', 470, tableTop + 8, { width: 80, align: 'right' });

    // Items
    let y = tableTop + 30;
    invoice.items.forEach((item, i) => {
      if (i % 2 === 0) doc.rect(40, y - 4, 515, 20).fill('#F7F0DE');
      doc.fillColor(dark).font('Helvetica').fontSize(9)
        .text(item.name, 50, y, { width: 270 })
        .text(item.quantity.toString(), 330, y, { width: 50, align: 'center' })
        .text(`Rs.${Number(item.price || 0).toFixed(2)}`, 390, y, { width: 70, align: 'right' })
        .text(`Rs.${Number(item.total || 0).toFixed(2)}`, 470, y, { width: 80, align: 'right' });
      y += 20;
    });

    // Totals
    const totalsY = y + 15;
    doc.moveTo(350, totalsY - 5).lineTo(555, totalsY - 5).lineWidth(0.5).strokeColor(gold).stroke();

    doc.fillColor(gray).font('Helvetica').fontSize(10)
      .text('Subtotal', 350, totalsY, { width: 130, align: 'left' })
      .text(`Rs.${Number(invoice.subtotal || 0).toFixed(2)}`, 480, totalsY, { width: 75, align: 'right' });

    doc.text(`GST (${invoice.gstRate}%)`, 350, totalsY + 18, { width: 130 })
      .text(`Rs.${Number(invoice.gstAmount || 0).toFixed(2)}`, 480, totalsY + 18, { width: 75, align: 'right' });

    doc.rect(350, totalsY + 36, 205, 26).fill(dark);
    doc.fillColor(gold).font('Helvetica-Bold').fontSize(12)
      .text('TOTAL', 360, totalsY + 42, { width: 100 })
      .text(`Rs.${Number(invoice.total || 0).toFixed(2)}`, 460, totalsY + 42, { width: 90, align: 'right' });

    // Payment
    doc.fillColor(gray).font('Helvetica').fontSize(9)
      .text(`Payment Method: ${(invoice.paymentMethod || 'cash').toUpperCase()}`, 40, totalsY + 50);

    // Footer
    const footerY = doc.page.height - 80;
    doc.moveTo(40, footerY).lineTo(555, footerY).lineWidth(0.5).strokeColor(gold).stroke();
    doc.fillColor(gray).font('Helvetica').fontSize(8)
      .text('Thank you for dining with us!', 40, footerY + 10, { align: 'center', width: 515 })
      .text('Shivam Restaurant | @shivam_resort_pali | Jodhpur Road, Pali', 40, footerY + 24, { align: 'center', width: 515 });

    doc.end();
  });
};
