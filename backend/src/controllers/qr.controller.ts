import { RequestHandler } from 'express';
import QRCode from 'qrcode';
import qrTicketCountModel from '../models/QrTicketCountModel';
import TransactionModel from '../models/TransactionModel';
import mongoose from 'mongoose';
import ScannedTicketModel from '../models/ScannedTiketModel';
import ScannedGelangModel from '../models/ScannedGelangModel';

function generateRandomStringAndNumber(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getWIBDate(): string {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wib = new Date(utc + (7 * 60 * 60000));
  const day = wib.getDate().toString().padStart(2, '0');
  const month = (wib.getMonth() + 1).toString().padStart(2, '0');
  const yearShort = wib.getFullYear().toString().slice(-2);
  return `${month}${day}${yearShort}`;
}

async function generateMultipleQRCodes(count: number): Promise<string[]> {
  if (count <= 0) {
    throw new Error('Jumlah QR code harus lebih dari 0.');
  }

  const qrCodes: string[] = [];
  const wibDate = getWIBDate();
  const currentYearFull = new Date().getFullYear();
  const yearFull = currentYearFull.toString();

  let qrCounter = await qrTicketCountModel.findOneAndUpdate(
    {},
    { $inc: { lastQrIdCounter: count } },
    { upsert: true, new: true }
  );

  const startId = qrCounter.lastQrIdCounter - count + 1;

  for (let i = startId; i <= qrCounter.lastQrIdCounter; i++) {
    const sequentialCountPadded = i.toString().padStart(6, '0');
    const randomId9Digit = generateRandomStringAndNumber(16);

    const qrContent = `TICKET-${sequentialCountPadded}-${wibDate}-${randomId9Digit}-MELOFEST${yearFull}`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
      width: 500,
      margin: 1,
      errorCorrectionLevel: 'H',
    });
    qrCodes.push(qrCodeDataUrl);
  }

  return qrCodes;
}

export const generateMultipleQRCodesHandler: RequestHandler = async (req: any, res: any) => {
  try {
    const { count } = req.body;
    const parsedCount = parseInt(count as string);

    if (isNaN(parsedCount) || parsedCount <= 0) {
      return res.status(400).json({ error: 'Jumlah QR code tidak valid.' });
    }

    const qrCodeUrls = await generateMultipleQRCodes(parsedCount);
    return res.status(200).json({ message: `${qrCodeUrls.length} QR code berhasil dibuat.`, dataUrls: qrCodeUrls });
  } catch (error: any) {
    console.error('Gagal membuat QR code:', error);
    return res.status(500).json({ error: 'Gagal membuat QR code.' });
  }
};

export const scanQRHandler: RequestHandler = async (req: any, res: any) => {
  const { qrCodeData } = req.body;

  if (!qrCodeData) {
    return res.status(400).json({ message: 'Data QR code tidak ditemukan dalam permintaan.', status: false });
  }

  try {
    // Validasi apakah qrCodeData adalah ObjectId yang valid
    if (!mongoose.Types.ObjectId.isValid(qrCodeData)) {
      return res.status(400).json({ message: 'Data QR code tidak valid.', status: false });
    }

    const uniqueTicketId = new mongoose.Types.ObjectId(qrCodeData);

    const transaction = await TransactionModel.findOne({
      'tickets.uniqueTicketId': uniqueTicketId,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Tiket dengan QR code ini tidak ditemukan.', status: false });
    }

    const ticketToUpdate = transaction.tickets.find(ticket => ticket.uniqueTicketId.equals(uniqueTicketId));

    if (ticketToUpdate) {
      if (ticketToUpdate.isScanned === false) {
        ticketToUpdate.isScanned = true;
        await transaction.save();

        // Simpan data ke model ScannedTicket
        const scannedTicket = new ScannedTicketModel({
          uniqueTicketId: ticketToUpdate.uniqueTicketId,
          transactionId: transaction._id,
          qrCodeData: qrCodeData,
          scannedByOperatorId: req.userId, // Ambil ID user dari req.user
        });
        await scannedTicket.save();

        return res.status(200).json({ message: 'Tiket berhasil dipindai.', status: true });
      } else {
        return res.status(409).json({ message: 'Tiket ini sudah digunakan.', status: false });
      }
    } else {
      return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status tiket.', status: false });
    }

  } catch (error) {
    console.error('Gagal memproses pemindaian QR code:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat memproses pemindaian.', status: false });
  }
};

export const getTicketByUniqueIdHandler: RequestHandler = async (req: any, res: any) => {
  const { uniqueTicketId } = req.params;

  if (!uniqueTicketId) {
    return res.status(400).json({ message: 'ID tiket tidak ditemukan dalam permintaan.', status: false });
  }

  if (!mongoose.Types.ObjectId.isValid(uniqueTicketId)) {
    return res.status(400).json({ message: 'ID tiket tidak valid.', status: false });
  }

  try {
    const objectIdUniqueTicketId = new mongoose.Types.ObjectId(uniqueTicketId);

    const transaction = await TransactionModel.findOne({
      'tickets.uniqueTicketId': objectIdUniqueTicketId,
    }, { 'tickets.$': 1 })
      .populate({
        path: 'userId',
        select: 'name email profile.dateOfBirth profile.gender' // Pilih field nama dan informasi lain dari model User
      });

    if (!transaction || !transaction.tickets || transaction.tickets.length === 0) {
      return res.status(404).json({ message: 'Tiket tidak ditemukan.', status: false });
    }

    const ticket = transaction.tickets[0];

    // Sekarang data user ada di dalam objek transaction
    const userData = transaction.userId;

    if (ticket.isScanned) {
      return res.status(200).json({
        message: 'Tiket sudah digunakan.',
        status: true,
        isScanned: true,
        user: userData // Tambahkan informasi user ke response
      });
    } else {
      return res.status(200).json({
        message: 'Tiket valid.',
        status: true,
        isScanned: false,
        user: userData // Tambahkan informasi user ke response
      });
    }

  } catch (error) {
    console.error('Gagal mengambil data tiket:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data tiket.', status: false });
  }
};

export const refundTicketHandler: RequestHandler = async (req: any, res: any) => {
  const { uniqueTicketId } = req.params;

  if (!uniqueTicketId) {
    return res.status(400).json({ message: 'ID tiket tidak ditemukan dalam permintaan.', status: false });
  }

  if (!mongoose.Types.ObjectId.isValid(uniqueTicketId)) {
    return res.status(400).json({ message: 'ID tiket tidak valid.', status: false });
  }

  try {
    const objectIdUniqueTicketId = new mongoose.Types.ObjectId(uniqueTicketId);

    const transaction = await TransactionModel.findOneAndUpdate(
      { 'tickets.uniqueTicketId': objectIdUniqueTicketId },
      { '$set': { 'tickets.$[element].isScanned': false } },
      { arrayFilters: [{ 'element.uniqueTicketId': objectIdUniqueTicketId }], new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Tiket tidak ditemukan.', status: false });
    }

    return res.status(200).json({ message: 'Status tiket berhasil diubah menjadi belum dipindai.', status: true });

  } catch (error) {
    console.error('Gagal memperbarui status tiket untuk refund:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat memproses refund.', status: false });
  }
};

export const deleteScannedTicketHandler: RequestHandler = async (req: any, res: any) => {
  const { uniqueTicketId } = req.params;

  if (!uniqueTicketId) {
    return res.status(400).json({ message: 'ID tiket tidak ditemukan dalam permintaan.', status: false });
  }

  if (!mongoose.Types.ObjectId.isValid(uniqueTicketId)) {
    return res.status(400).json({ message: 'ID tiket tidak valid.', status: false });
  }

  try {
    const result = await ScannedTicketModel.deleteOne({ uniqueTicketId: new mongoose.Types.ObjectId(uniqueTicketId) });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: 'Data tiket berhasil dihapus dari catatan scan.', status: true });
    } else {
      return res.status(404).json({ message: 'Data tiket tidak ditemukan dalam catatan scan.', status: false });
    }
  } catch (error) {
    console.error('Gagal menghapus data tiket dari catatan scan:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus data dari catatan scan.', status: false });
  }
};

export const deleteScannedTicketGelangHandler: RequestHandler = async (req: any, res: any) => {
  const { barcode } = req.params;
  console.log('Attempting to delete ticket with barcode:', barcode);

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode tiket tidak ditemukan dalam permintaan.', status: false });
  }

  try {
    // Try finding by _id first if the barcode looks like an ObjectId
    if (barcode.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Barcode looks like an ObjectId, trying to find by _id');
      const ticketById = await ScannedTicketModel.findById(barcode);
      if (ticketById) {
        const result = await ScannedTicketModel.deleteOne({ _id: ticketById._id });
        if (result.deletedCount > 0) {
          return res.status(200).json({ message: 'Data tiket berhasil dihapus dari catatan scan.', status: true });
        }
      }
    }

    // If not found by _id, try to find by barcode
    console.log('Searching for barcode match');
    const scannedTicket = await ScannedTicketModel.findOne({ barcode: { $regex: new RegExp('^' + barcode + '$', 'i') } });

    if (!scannedTicket) {
      console.log('No ticket found with barcode:', barcode);
      return res.status(404).json({ message: 'Data tiket dengan barcode tersebut tidak ditemukan dalam catatan scan.', status: false });
    }

    console.log('Found ticket:', scannedTicket);
    const result = await ScannedTicketModel.deleteOne({ _id: scannedTicket._id });

    if (result.deletedCount > 0) {
      console.log('Successfully deleted ticket');
      return res.status(200).json({ message: 'Data tiket dengan barcode berhasil dihapus dari catatan scan.', status: true });
    } else {
      console.log('Failed to delete ticket');
      return res.status(500).json({ message: 'Gagal menghapus data tiket.', status: false });
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus data dari catatan scan.', status: false });
  }
};

export const getScannedTicketsHandler: RequestHandler = async (req: any, res: any) => {
  try {
    const scannedTickets = await ScannedTicketModel.find()
      .populate({
        path: 'transactionId',
        populate: {
          path: 'userId',
          select: 'name email profile.dateOfBirth profile.gender', // Data user pemilik tiket
        },
      })
      .populate({
        path: 'scannedByOperatorId',
        select: 'name email', // Data operator yang melakukan scan
      });

    return res.status(200).json({
      status: true,
      message: 'Data log voucher tiket berhasil diambil.',
      data: scannedTickets,
    });
  } catch (error) {
    console.error('Gagal mengambil data log voucher tiket:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server saat mengambil data log voucher tiket.',
    });
  }
};


const GELANG_BARCODE_FORMAT = /^TICKET-\d{6}-\d{6}-\w{16}-MELOFEST\d{4}$/;

export const scanGelangHandler: RequestHandler = async (req: any, res: any) => {
  const { barcode } = req.body;

  if (!barcode) {
      return res.status(400).json({ message: 'Data barcode tidak ditemukan dalam permintaan.', status: false });
  }

  const GELANG_BARCODE_FORMAT = /^TICKET-\d{6}-\d{6}-\w{16}-MELOFEST\d{4}$/;
  if (!GELANG_BARCODE_FORMAT.test(barcode)) {
      return res.status(400).json({ message: 'Format barcode tidak valid.', status: false });
  }

  try {
      const existingScan = await ScannedGelangModel.findOne({ barcode });

      if (existingScan) {
          return res.status(409).json({
              status: false,
              message: 'Gelang ini sudah pernah di-scan sebelumnya.',
              lastScanTime: existingScan.scanTime // Sertakan waktu scan sebelumnya
          });
      }

      const scannedGelang = new ScannedGelangModel({ barcode, scannedByOperatorId: req.user?._id });
      await scannedGelang.save();

      return res.status(200).json({ message: 'Scan gelang berhasil.', status: true });

  } catch (error) {
      console.error('Gagal memproses scan gelang:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan server saat memproses scan gelang.', status: false });
  }
};

export const getGelangStatusHandler: RequestHandler = async (req: any, res: any) => {
  const { barcode } = req.params;

  if (!barcode) {
      return res.status(400).json({ status: false, message: 'Barcode tidak ditemukan dalam permintaan.' });
  }

  try {
      const scannedGelang = await ScannedGelangModel.findOne({ barcode });

      if (scannedGelang) {
          return res.status(200).json({
              status: true,
              isScanned: true,
              message: 'Gelang sudah pernah di-scan.',
              lastScanTime: scannedGelang.scanTime
          });
      } else {
          return res.status(200).json({
              status: true,
              isScanned: false,
              message: 'Gelang belum pernah di-scan.'
          });
      }
  } catch (error) {
      console.error('Gagal memeriksa status gelang:', error);
      return res.status(500).json({ status: false, message: 'Terjadi kesalahan server saat memeriksa status gelang.' });
  }
};

export const getScannedGelangHandler: RequestHandler = async (req: any, res: any) => {
  try {
    const scannedGelangs = await ScannedGelangModel.find().populate('scannedByOperatorId'); // Populate jika perlu
    return res.status(200).json({ status: true, message: 'Data log scan gelang berhasil diambil.', data: scannedGelangs });
  } catch (error) {
    console.error('Gagal mengambil data log scan gelang:', error);
    return res.status(500).json({ status: false, message: 'Terjadi kesalahan server saat mengambil data log scan gelang.' });
  }
};
