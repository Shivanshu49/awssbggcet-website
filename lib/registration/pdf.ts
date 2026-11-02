// lib/registration/pdf.ts — Server-side PDF entry ticket generation using pdf-lib
import "server-only";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface TicketData {
  attendeeName: string;
  registrationId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  college: string;
  qrPngBase64: string; // data URL or pure base64
}

export async function generateEntryPassPdf(data: TicketData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // 600 x 320 px conference badge / horizontal pass
  const page = pdfDoc.addPage([600, 320]);

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background: Deep dark theme (#090511 -> rgb(9/255, 5/255, 17/255))
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 600,
    height: 320,
    color: rgb(0.035, 0.02, 0.067),
  });

  // Top header banner background (#1F1235)
  page.drawRectangle({
    x: 0,
    y: 260,
    width: 600,
    height: 60,
    color: rgb(0.12, 0.07, 0.21),
  });

  // Border outline
  page.drawRectangle({
    x: 10,
    y: 10,
    width: 580,
    height: 300,
    borderColor: rgb(0.3, 0.16, 0.4),
    borderWidth: 1.5,
  });

  // Header Text
  page.drawText("AWS BUILDER CENTER GCET", {
    x: 30,
    y: 288,
    size: 11,
    font: helveticaBold,
    color: rgb(0.98, 0.75, 0.14), // Amber
  });

  page.drawText("OFFICIAL DIGITAL ENTRY PASS", {
    x: 30,
    y: 272,
    size: 9,
    font: helvetica,
    color: rgb(0.7, 0.65, 0.8),
  });

  // Registration ID Badge (Top right)
  page.drawText(data.registrationId, {
    x: 430,
    y: 280,
    size: 12,
    font: helveticaBold,
    color: rgb(0.98, 0.75, 0.14),
  });

  // Left Content Column: Attendee & Event Details
  page.drawText(data.eventTitle.toUpperCase(), {
    x: 30,
    y: 228,
    size: 15,
    font: helveticaBold,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Attendee Info
  page.drawText("ATTENDEE", {
    x: 30,
    y: 195,
    size: 8,
    font: helveticaBold,
    color: rgb(0.65, 0.6, 0.72),
  });

  page.drawText(data.attendeeName, {
    x: 30,
    y: 178,
    size: 14,
    font: helveticaBold,
    color: rgb(0.98, 0.98, 0.98),
  });

  page.drawText(data.college, {
    x: 30,
    y: 162,
    size: 9,
    font: helvetica,
    color: rgb(0.8, 0.75, 0.88),
  });

  // Event Details Grid
  const labelY = 125;
  const valY = 110;

  page.drawText("DATE & TIME", {
    x: 30,
    y: labelY,
    size: 8,
    font: helveticaBold,
    color: rgb(0.65, 0.6, 0.72),
  });
  page.drawText(`${data.eventDate} | ${data.eventTime}`, {
    x: 30,
    y: valY,
    size: 9,
    font: helvetica,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText("VENUE", {
    x: 30,
    y: 75,
    size: 8,
    font: helveticaBold,
    color: rgb(0.65, 0.6, 0.72),
  });
  page.drawText(data.venue, {
    x: 30,
    y: 60,
    size: 9,
    font: helvetica,
    color: rgb(0.95, 0.95, 0.95),
  });

  page.drawText("Please present this pass with a valid college ID at the registration desk.", {
    x: 30,
    y: 28,
    size: 7.5,
    font: helvetica,
    color: rgb(0.6, 0.55, 0.65),
  });

  // Right Column: QR Code
  if (data.qrPngBase64) {
    const base64Data = data.qrPngBase64.replace(/^data:image\/png;base64,/, "");
    const qrImageBytes = Buffer.from(base64Data, "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    // QR Code Container Box
    page.drawRectangle({
      x: 410,
      y: 55,
      width: 155,
      height: 175,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.98, 0.75, 0.14),
      borderWidth: 1.5,
    });

    page.drawImage(qrImage, {
      x: 420,
      y: 80,
      width: 135,
      height: 135,
    });

    page.drawText("SCAN AT ENTRY", {
      x: 445,
      y: 64,
      size: 8,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  return await pdfDoc.save();
}

