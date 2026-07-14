import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const convertNumberToWords = (num) => {
  const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  if ((num = Math.floor(num).toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  const result = str.trim() + ' only';
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const generateInvoicePDF = async (invoice) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 30 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const gold = '#B8860B';
    const dark = '#000000';
    const light = '#FFFFFF';
    const grey = '#F5F5F5';

    // Header
    doc.rect(0, 0, doc.page.width, 180).fill(dark);
    doc.fillColor(gold).font('Helvetica-Bold').fontSize(32).text('SHIVAM', 40, 40);
    doc.fillColor(light).font('Helvetica').fontSize(14).text('RESORT & RESTAURANT', 40, 75);
    doc.fillColor(light).font('Helvetica').fontSize(9)
       .text((invoice.restaurantAddress || 'Jodhpur Road, Ghumti, Pali, Rajasthan').toUpperCase(), 40, 100)
       .text(`Phone: +91 99999 99999 | Email: info@shivamresort.com | Web: www.shivamresort.com`, 40, 115)
       .text(`GSTIN: ${invoice.gstin || '24AAAAA0000A1Z5'} | FSSAI: ${invoice.fssai || '12345678901234'}`, 40, 130);

    doc.fillColor(light).font('Helvetica-Bold').fontSize(24).text('INVOICE', 400, 40, { align: 'right' });
    doc.fillColor(gold).font('Helvetica').fontSize(10).text(`No: ${invoice.invoiceNumber}`, 400, 70, { align: 'right' });

    // Details Grid
    const yInfo = 200;
    doc.fillColor(dark).font('Helvetica-Bold').fontSize(10).text('BILL TO:', 40, yInfo);
    doc.fillColor(dark).font('Helvetica').fontSize(10)
       .text(`${invoice.customerName}`, 40, yInfo + 15)
       .text(`Ph: ${invoice.customerPhone}`, 40, yInfo + 30);

    doc.fillColor(dark).font('Helvetica-Bold').fontSize(10).text('ORDER INFO:', 300, yInfo);
    doc.font('Helvetica').fontSize(10)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 300, yInfo + 15)
       .text(`Table: ${invoice.tableNumber || '-'} | Guests: 2`, 300, yInfo + 30);

    // Items Table
    const tableTop = 270;
    doc.rect(40, tableTop, 520, 25).fill(grey);
    doc.fillColor(dark).font('Helvetica-Bold').fontSize(9)
       .text('ITEM', 50, tableTop + 8)
       .text('QTY', 300, tableTop + 8, { width: 50, align: 'center' })
       .text('PRICE', 360, tableTop + 8, { width: 60, align: 'right' })
       .text('GST%', 430, tableTop + 8, { width: 40, align: 'right' })
       .text('TOTAL', 490, tableTop + 8, { width: 70, align: 'right' });

    let y = tableTop + 35;
    invoice.items.forEach((item, i) => {
      doc.fillColor(dark).font('Helvetica').fontSize(9)
         .text(item.name, 50, y, { width: 250 })
         .text(item.quantity.toString(), 300, y, { width: 50, align: 'center' })
         .text(`₹${Number(item.price).toFixed(2)}`, 360, y, { width: 60, align: 'right' })
         .text(`${invoice.gstRate || 5}%`, 430, y, { width: 40, align: 'right' })
         .text(`₹${Number(item.total).toFixed(2)}`, 490, y, { width: 70, align: 'right' });
      y += 20;
    });

    // Summary
    const sumY = y + 20;
    doc.moveTo(40, sumY).lineTo(560, sumY).stroke(gold);

    const rightCol = 520;
    let sY = sumY + 15;
    const row = (l, v) => {
        doc.font('Helvetica').fontSize(9).text(l, 350, sY, { width: 130, align: 'right' })
           .text(`₹${Number(v).toFixed(2)}`, 450, sY, { width: 70, align: 'right' });
        sY += 18;
    };
    row('Subtotal', invoice.subtotal);
    row('Discount', invoice.discount || 0);
    row('Taxable Amount', invoice.taxableAmount || (invoice.subtotal - (invoice.discount || 0)));
    row('CGST (2.5%)', (invoice.gstAmount || 0) / 2);
    row('SGST (2.5%)', (invoice.gstAmount || 0) / 2);
    row('Service Charge', invoice.serviceCharge || 0);

    doc.rect(350, sY + 5, 210, 35).fill(dark);
    doc.fillColor(gold).font('Helvetica-Bold').fontSize(14)
       .text('GRAND TOTAL:', 350, sY + 14, { width: 90, align: 'right' })
       .text(`₹${Number(invoice.total).toFixed(2)}`, 440, sY + 14, { width: 120, align: 'right' });

    doc.fillColor(dark).font('Helvetica-Oblique').fontSize(8)
       .text(`In words: ${convertNumberToWords(invoice.total)}`, 40, sY + 50);

    // Payment Info
    doc.font('Helvetica-Bold').fontSize(9).text('PAYMENT INFO:', 40, sY + 70);
    doc.font('Helvetica').fontSize(9)
       .text(`Method: ${invoice.paymentMethod || 'Cash'} | Status: ${invoice.paymentStatus || 'Paid'}`, 40, sY + 85)
       .text(`Verified By: Admin | Time: ${new Date(invoice.paidAt).toLocaleString()}`, 40, sY + 100);

    // QR
    // Using a placeholder frontend URL for invoice lookup. Replace with actual environment variable in production.
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrCode = await QRCode.toDataURL(`${baseUrl}/invoice/${invoice._id}`);
    doc.image(qrCode, 450, sY + 60, { width: 70 });

    // Footer
    doc.fillColor(dark).fontSize(8).font('Helvetica-Bold')
       .text('Thank You for Visiting Shivam Resort & Restaurant', 40, doc.page.height - 70, { align: 'center', width: 520 })
       .text('Visit Again | Prices Inclusive of GST | This is a Computer Generated Invoice', 40, doc.page.height - 55, { align: 'center', width: 520 });

    doc.end();
  });
};
