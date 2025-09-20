// src/services/ticketService.ts

import fs from "fs/promises";
import path from "path";
import qrcode from "qrcode";
import mongoose from "mongoose";
import { generateTicketImage } from "../utils/imageGenerator";

// Fungsi ini akan dipanggil oleh controller transaksi
export async function processAndGenerateTicket(ticketDoc: any) {
  const subdocumentId = new mongoose.Types.ObjectId();
  const timestamp = Date.now();

  // Dapatkan detail event dari dokumen tiket yang sudah di-populate
  const eventDetails = ticketDoc.eventId;

  // 1. Generate QR Code
  const qrCodeData = subdocumentId.toString();
  const qrCodeFileName = `qr-${subdocumentId}-${timestamp}.png`;
  const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');
  await fs.mkdir(qrCodesDir, { recursive: true }); // Pastikan direktori ada
  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
    errorCorrectionLevel: 'M', margin: 1, width: 250
  });
  await fs.writeFile(qrCodeFilePath, qrCodeDataURL.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // 2. Generate Gambar Tiket
  const ticketDataForImage = {
    eventName: eventDetails.eventName,
    category: ticketDoc.category
  };

  const templatePath = path.join(__dirname, `../assets/templates/${ticketDoc.templateImage}`);
  const ticketImageBase64 = await generateTicketImage(ticketDataForImage, qrCodeFilePath, templatePath);

  // 3. Simpan Gambar Tiket Final
  const ticketFileName = `ticket-${subdocumentId}-${timestamp}.png`;
  const ticketsDir = path.join(__dirname, '../../uploads/tickets');
  await fs.mkdir(ticketsDir, { recursive: true });
  const ticketFilePath = path.join(ticketsDir, ticketFileName);
  await fs.writeFile(ticketFilePath, ticketImageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // Hapus file QR code sementara karena sudah digabungkan ke gambar tiket
  await fs.unlink(qrCodeFilePath);

  // 4. Return data yang siap disimpan ke database
  return {
    _id: subdocumentId,
    ticketId: ticketDoc._id,
    qrCode: `/uploads/qrcodes/${qrCodeFileName}`, // Path URL
    ticketImage: `/uploads/tickets/${ticketFileName}`, // Path URL
  };
}
