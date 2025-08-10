import { RequestHandler } from "express";
import mongoose, { Types } from "mongoose";
import UserModel from "../models/UserModel";
import TransactionModel, { ITransaction } from "../models/TransactionModel";
import { CREATED, NOT_FOUND, BAD_REQUEST, OK, INTERNAL_SERVER_ERROR}  from "../constants/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { z } from "zod";
import TicketModel, { ITicket } from "../models/TicketModel";
import qrcode from 'qrcode'
import path from 'path';
import fs from 'fs';
import { createCanvas, loadImage } from "canvas";
import ArchivedTransactionModel from "../models/ArchievedTransaction";


// transaction.controller.ts
export const transactionSchema = z.object({
  tickets: z.array(
      z.object({
          ticketId: z.string(),
          quantity: z.number().int().positive(),
      }),
  ),
  totalPrice: z.number().positive(),
  transactionMethod: z.enum(["Online", "On The Site", "On The Spot"])
});

export const adminTransactionSchema = z.object({
  userId: z.string(),
  tickets: z.array(
      z.object({
          ticketId: z.string(),
          quantity: z.number().int().positive(),
      }),
  ),
  totalPrice: z.number().positive(),
  transactionMethod: z.enum(["Online", "On The Site", "On The Spot"])
});

export async function generateTicketImage(ticketData: any, qrCodeImagePath: string) {
  try {
    // Tentukan beberapa kemungkinan path untuk template tiket
    const possiblePaths = [
      // Path relatif dari lokasi file script
      path.join(__dirname, "../assets/ticket-template.png"),
      // Path mencari di src/assets
      path.join(process.cwd(), "src/assets/ticket-template.png"),
      // Path mencari di dist/assets
      path.join(process.cwd(), "dist/assets/ticket-template.png"),
      // Path absolut yang lebih spesifik berdasarkan lokasi server
      "/var/www/melophilefestival.com/melofest/backend/src/assets/ticket-template.png",
      "/var/www/melophilefestival.com/melofest/backend/dist/assets/ticket-template.png"
    ];

    // Cari path yang valid
    let templatePath = null;
    for (const p of possiblePaths) {
      console.log(`Checking template path: ${p}`);
      if (fs.existsSync(p)) {
        templatePath = p;
        console.log(`Found template at: ${templatePath}`);
        break;
      }
    }

    // Jika tidak menemukan template, kembalikan path QR code saja
    if (!templatePath) {
      console.warn("Could not find ticket template - using QR code only");
      return qrCodeImagePath;
    }

    const templateImage = await loadImage(templatePath);
    const qrImage = await loadImage(qrCodeImagePath);

    // Buat canvas dan gambar template
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);
    ctx.drawImage(qrImage, 1340, 200, 250, 250);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error generating ticket image:', error);
    return qrCodeImagePath;
  }
}
export async function generateTicketImage2(ticketData: any, qrCodeImagePath: string) {
  try {
    // Tentukan beberapa kemungkinan path untuk template tiket
    const possiblePaths = [
      // Path relatif dari lokasi file script
      path.join(__dirname, "../assets/ticket-template-presale-2.jpg"),
      // Path mencari di src/assets
      path.join(process.cwd(), "src/assets/ticket-template-presale-2.jpg"),
      // Path mencari di dist/assets
      path.join(process.cwd(), "dist/assets/ticket-template-presale-2.jpg"),
      // Path absolut yang lebih spesifik berdasarkan lokasi server
      "/var/www/melophilefestival.com/melofest/backend/src/assets/ticket-template-presale-2.jpg",
      "/var/www/melophilefestival.com/melofest/backend/dist/assets/ticket-template-presale-2.jpg"
    ];

    // Cari path yang valid
    let templatePath = null;
    for (const p of possiblePaths) {
      console.log(`Checking template path: ${p}`);
      if (fs.existsSync(p)) {
        templatePath = p;
        console.log(`Found template at: ${templatePath}`);
        break;
      }
    }

    // Jika tidak menemukan template, kembalikan path QR code saja
    if (!templatePath) {
      console.warn("Could not find ticket template - using QR code only");
      return qrCodeImagePath;
    }

    const templateImage = await loadImage(templatePath);
    const qrImage = await loadImage(qrCodeImagePath);

    // Buat canvas dan gambar template
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);
    ctx.drawImage(qrImage, 1325, 180, 250, 250);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error generating ticket image:', error);
    return qrCodeImagePath;
  }
}
export async function generateTicketImage3(ticketData: any, qrCodeImagePath: string) {
  try {
    // Tentukan beberapa kemungkinan path untuk template tiket
    const possiblePaths = [
      // Path relatif dari lokasi file script
      path.join(__dirname, "../assets/ticket-template-presale-3.jpg"),
      // Path mencari di src/assets
      path.join(process.cwd(), "src/assets/ticket-template-presale-3.jpg"),
      // Path mencari di dist/assets
      path.join(process.cwd(), "dist/assets/ticket-template-presale-3.jpg"),
      // Path absolut yang lebih spesifik berdasarkan lokasi server
      "/var/www/melophilefestival.com/melofest/backend/src/assets/ticket-template-presale-3.jpg",
      "/var/www/melophilefestival.com/melofest/backend/dist/assets/ticket-template-presale-3.jpg"
    ];

    // Cari path yang valid
    let templatePath = null;
    for (const p of possiblePaths) {
      console.log(`Checking template path: ${p}`);
      if (fs.existsSync(p)) {
        templatePath = p;
        console.log(`Found template at: ${templatePath}`);
        break;
      }
    }

    // Jika tidak menemukan template, kembalikan path QR code saja
    if (!templatePath) {
      console.warn("Could not find ticket template - using QR code only");
      return qrCodeImagePath;
    }

    const templateImage = await loadImage(templatePath);
    const qrImage = await loadImage(qrCodeImagePath);

    // Buat canvas dan gambar template
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);
    ctx.drawImage(qrImage, 1323, 180, 250, 250);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error generating ticket image:', error);
    return qrCodeImagePath;
  }
}
export async function generateTicketImage4(ticketData: any, qrCodeImagePath: string) {
  try {
    // Tentukan beberapa kemungkinan path untuk template tiket
    const possiblePaths = [
      // Path relatif dari lokasi file script
      path.join(__dirname, "../assets/blind-ticket-template.jpg"),
      // Path mencari di src/assets
      path.join(process.cwd(), "src/assets/blind-ticket-template.jpg"),
      // Path mencari di dist/assets
      path.join(process.cwd(), "dist/assets/blind-ticket-template.jpg"),
      // Path absolut yang lebih spesifik berdasarkan lokasi server
      "/var/www/melophilefestival.com/melofest/backend/src/assets/blind-ticket-template.jpg",
      "/var/www/melophilefestival.com/melofest/backend/dist/assets/blind-ticket-template.jpg"
    ];

    // Cari path yang valid
    let templatePath = null;
    for (const p of possiblePaths) {
      console.log(`Checking template path: ${p}`);
      if (fs.existsSync(p)) {
        templatePath = p;
        console.log(`Found template at: ${templatePath}`);
        break;
      }
    }

    // Jika tidak menemukan template, kembalikan path QR code saja
    if (!templatePath) {
      console.warn("Could not find ticket template - using QR code only");
      return qrCodeImagePath;
    }

    const templateImage = await loadImage(templatePath);
    const qrImage = await loadImage(qrCodeImagePath);

    // Buat canvas dan gambar template
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);
    ctx.drawImage(qrImage, 1323, 180, 250, 250);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'black';

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error generating ticket image:', error);
    return qrCodeImagePath;
  }
}

export const createTransactionHandler: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const userId = req.user?._id;
          const validatedData = transactionSchema.parse(req.body);
          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          // Pastikan direktori uploads ada
          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          // Buat direktori jika belum ada
          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          let formattedTickets = [];
          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  // Buat QR code sebagai dataURL (seperti di kode asli)
                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                    errorCorrectionLevel: 'M',
                    margin: 1,
                    width: 200
                  });

                  // Buat nama file unik untuk QR code
                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  // Simpan dataURL sebagai file gambar
                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  // Path URL untuk QR code
                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                    eventName: ticket.eventName,
                    category: ticket.category,
                    date: '13 Mei 2025'
                  };

                  // Generate complete ticket image with template and QR code
                  const ticketImageBase64 = await generateTicketImage(ticketData, qrCodeFilePath);

                  // Create a unique filename for the ticket image
                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  // Convert base64 data to image file and save it
                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  // Create URL path to be stored in database
                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,  // Simpan URL file QR code, bukan base64
                      ticketImage: ticketFileUrl  // URL file tiket
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
            userId,
            tickets: formattedTickets,
            totalTicket,
            totalPrice: validatedData.totalPrice || totalPrice, // Use frontend totalPrice if provided
            status: "pending",
            transactionMethod: validatedData.transactionMethod,
            expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createTransactionPresale2Handler: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const userId = req.user?._id;
          const validatedData = transactionSchema.parse(req.body);
          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          // Pastikan direktori uploads ada
          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          // Buat direktori jika belum ada
          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          let formattedTickets = [];
          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  // Buat QR code sebagai dataURL (seperti di kode asli)
                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                    errorCorrectionLevel: 'M',
                    margin: 1,
                    width: 200
                  });

                  // Buat nama file unik untuk QR code
                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  // Simpan dataURL sebagai file gambar
                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  // Path URL untuk QR code
                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                    eventName: ticket.eventName,
                    category: ticket.category,
                    date: '13 Mei 2025'
                  };

                  // Generate complete ticket image with template and QR code
                  const ticketImageBase64 = await generateTicketImage2(ticketData, qrCodeFilePath);

                  // Create a unique filename for the ticket image
                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  // Convert base64 data to image file and save it
                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  // Create URL path to be stored in database
                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,  // Simpan URL file QR code, bukan base64
                      ticketImage: ticketFileUrl  // URL file tiket
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
            userId,
            tickets: formattedTickets,
            totalTicket,
            totalPrice: validatedData.totalPrice || totalPrice, // Use frontend totalPrice if provided
            status: "pending",
            transactionMethod: validatedData.transactionMethod,
            expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createTransactionPresale3Handler: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const userId = req.user?._id;
          const validatedData = transactionSchema.parse(req.body);
          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          // Pastikan direktori uploads ada
          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          // Buat direktori jika belum ada
          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          let formattedTickets = [];
          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  // Buat QR code sebagai dataURL (seperti di kode asli)
                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                    errorCorrectionLevel: 'M',
                    margin: 1,
                    width: 200
                  });

                  // Buat nama file unik untuk QR code
                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  // Simpan dataURL sebagai file gambar
                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  // Path URL untuk QR code
                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                    eventName: ticket.eventName,
                    category: ticket.category,
                    date: '13 Mei 2025'
                  };

                  // Generate complete ticket image with template and QR code
                  const ticketImageBase64 = await generateTicketImage3(ticketData, qrCodeFilePath);

                  // Create a unique filename for the ticket image
                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  // Convert base64 data to image file and save it
                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  // Create URL path to be stored in database
                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,  // Simpan URL file QR code, bukan base64
                      ticketImage: ticketFileUrl  // URL file tiket
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
            userId,
            tickets: formattedTickets,
            totalTicket,
            totalPrice: validatedData.totalPrice || totalPrice, // Use frontend totalPrice if provided
            status: "pending",
            transactionMethod: validatedData.transactionMethod,
            expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createTransactionPresale4Handler: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const userId = req.user?._id;
          const validatedData = transactionSchema.parse(req.body);
          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          // Pastikan direktori uploads ada
          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          // Buat direktori jika belum ada
          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          let formattedTickets = [];
          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  // Buat QR code sebagai dataURL (seperti di kode asli)
                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                    errorCorrectionLevel: 'M',
                    margin: 1,
                    width: 200
                  });

                  // Buat nama file unik untuk QR code
                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  // Simpan dataURL sebagai file gambar
                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  // Path URL untuk QR code
                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                    eventName: ticket.eventName,
                    category: ticket.category,
                    date: '13 Mei 2025'
                  };

                  // Generate complete ticket image with template and QR code
                  const ticketImageBase64 = await generateTicketImage4(ticketData, qrCodeFilePath);

                  // Create a unique filename for the ticket image
                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  // Convert base64 data to image file and save it
                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  // Create URL path to be stored in database
                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,  // Simpan URL file QR code, bukan base64
                      ticketImage: ticketFileUrl  // URL file tiket
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
            userId,
            tickets: formattedTickets,
            totalTicket,
            totalPrice: validatedData.totalPrice || totalPrice, // Use frontend totalPrice if provided
            status: "pending",
            transactionMethod: validatedData.transactionMethod,
            expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};

export const createAdminTransactionHandler: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const adminUserId = req.user?._id;
          const validatedData = adminTransactionSchema.parse(req.body);
          const userId = validatedData.userId;

          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          let formattedTickets = []; // Definisikan di sini

          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                      errorCorrectionLevel: 'M',
                      margin: 1,
                      width: 200
                  });

                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                      eventName: ticket.eventName,
                      category: ticket.category,
                      date: '13 Mei 2025'
                  };

                  const ticketImageBase64 = await generateTicketImage(ticketData, qrCodeFilePath);

                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,
                      ticketImage: ticketFileUrl
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
              userId,
              tickets: formattedTickets,
              totalTicket,
              totalPrice: validatedData.totalPrice || totalPrice,
              status: "pending",
              transactionMethod: validatedData.transactionMethod,
              expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createAdminTransactionHandler2: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const adminUserId = req.user?._id;
          const validatedData = adminTransactionSchema.parse(req.body);
          const userId = validatedData.userId;

          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          let formattedTickets = []; // Definisikan di sini

          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                      errorCorrectionLevel: 'M',
                      margin: 1,
                      width: 200
                  });

                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                      eventName: ticket.eventName,
                      category: ticket.category,
                      date: '13 Mei 2025'
                  };

                  const ticketImageBase64 = await generateTicketImage2(ticketData, qrCodeFilePath);

                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,
                      ticketImage: ticketFileUrl
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
              userId,
              tickets: formattedTickets,
              totalTicket,
              totalPrice: validatedData.totalPrice || totalPrice,
              status: "pending",
              transactionMethod: validatedData.transactionMethod,
              expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createAdminTransactionHandler3: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const adminUserId = req.user?._id;
          const validatedData = adminTransactionSchema.parse(req.body);
          const userId = validatedData.userId;

          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          let formattedTickets = []; // Definisikan di sini

          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                      errorCorrectionLevel: 'M',
                      margin: 1,
                      width: 200
                  });

                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                      eventName: ticket.eventName,
                      category: ticket.category,
                      date: '13 Mei 2025'
                  };

                  const ticketImageBase64 = await generateTicketImage3(ticketData, qrCodeFilePath);

                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,
                      ticketImage: ticketFileUrl
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
              userId,
              tickets: formattedTickets,
              totalTicket,
              totalPrice: validatedData.totalPrice || totalPrice,
              status: "pending",
              transactionMethod: validatedData.transactionMethod,
              expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};
export const createAdminTransactionHandler4: RequestHandler = async (req, res, next) => {
  let retries = 3;
  let success = false;

  while (retries > 0 && !success) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
          const adminUserId = req.user?._id;
          const validatedData = adminTransactionSchema.parse(req.body);
          const userId = validatedData.userId;

          const ticketIds = validatedData.tickets.map((t) => t.ticketId);

          const areValidIds = ticketIds.every(id => mongoose.Types.ObjectId.isValid(id));
          appAssert(areValidIds, BAD_REQUEST, "Invalid ticket ID format", AppErrorCode.InvalidTicketId);

          const tickets = await TicketModel.find({ _id: { $in: ticketIds } }).populate('eventName').session(session);
          appAssert(tickets.length === ticketIds.length, NOT_FOUND, "Some tickets not found", AppErrorCode.TicketNotFound);

          const uploadsDir = path.join(__dirname, '../../uploads/tickets');
          const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

          [uploadsDir, qrCodesDir].forEach(dir => {
              if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
              }
          });

          let totalPrice = 0;
          let totalTicket = 0;
          let formattedTickets = []; // Definisikan di sini

          const ticketMap = new Map<string, ITicket>(tickets.map(t => [t._id.toString(), t]));

          for (const t of validatedData.tickets) {
              const ticket = ticketMap.get(t.ticketId);
              appAssert(ticket, NOT_FOUND, "Ticket not found", AppErrorCode.TicketNotFound);
              appAssert(ticket.stock >= t.quantity, BAD_REQUEST, `Not enough stock for ${ticket.category}`, AppErrorCode.NotEnoughStock);

              for (let i = 0; i < t.quantity; i++) {
                  const uniqueTicketId = new mongoose.Types.ObjectId();
                  const qrCodeData = uniqueTicketId.toString();

                  console.log("QR Code Data (createTransactionHandler):", qrCodeData);

                  const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
                      errorCorrectionLevel: 'M',
                      margin: 1,
                      width: 200
                  });

                  const timestamp = new Date().getTime();
                  const qrCodeFileName = `qr-${uniqueTicketId}-${timestamp}.png`;
                  const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

                  const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

                  const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

                  const ticketData = {
                      eventName: ticket.eventName,
                      category: ticket.category,
                      date: '13 Mei 2025'
                  };

                  const ticketImageBase64 = await generateTicketImage4(ticketData, qrCodeFilePath);

                  const ticketFileName = `ticket-${uniqueTicketId}-${timestamp}.jpg`;
                  const ticketFilePath = path.join(uploadsDir, ticketFileName);

                  const base64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
                  fs.writeFileSync(ticketFilePath, base64Data, 'base64');

                  const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

                  formattedTickets.push({
                      uniqueTicketId: uniqueTicketId,
                      ticketId: ticket._id,
                      qrCode: qrCodeUrl,
                      ticketImage: ticketFileUrl
                  });
              }
              totalPrice += ticket.price * t.quantity;
              totalTicket += t.quantity;
              ticket.stock -= t.quantity;
          }

          await Promise.all(tickets.map(async (ticket) => {
              await TicketModel.updateOne(
                  { _id: ticket._id },
                  { stock: ticket.stock },
                  { session }
              );
          }));

          const transaction = new TransactionModel({
              userId,
              tickets: formattedTickets,
              totalTicket,
              totalPrice: validatedData.totalPrice || totalPrice,
              status: "pending",
              transactionMethod: validatedData.transactionMethod,
              expiredAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          await transaction.save({ session });

          await UserModel.findByIdAndUpdate(
              userId,
              { $push: { historyTransaction: transaction._id } },
              { session }
          );

          await session.commitTransaction();
          success = true;

          res.status(CREATED).json({
              _id: transaction._id,
              totalPrice: transaction.totalPrice,
              expiredAt: transaction.expiredAt,
              tickets: transaction.tickets
          });

      } catch (error: any) {
          await session.abortTransaction();
          if (error.code === 112 && error.errorLabels?.includes("TransientTransactionError")) {
              console.log(`Transaction failed with write conflict. Retries left: ${retries}, error: ${error}`);
              await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
              next(error);
              return;
          }
      } finally {
          session.endSession();
      }

      retries--;
  }

  if (!success) {
      next(new Error("Failed to complete transaction after multiple attempts"));
  }
};

export const uploadProofHandler: RequestHandler = async (req: any, res: any, next) => {
  // Debug information to help troubleshoot
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("Request params:", req.params);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionId = req.params.transactionId || req.params.id;

    console.log("Transaction ID:", transactionId);

    appAssert(
      mongoose.Types.ObjectId.isValid(transactionId),
      BAD_REQUEST,
      "Invalid transaction ID format",
      AppErrorCode.InvalidTransactionId
    );

    const transaction = await TransactionModel.findById(transactionId).session(session);
    appAssert(transaction, NOT_FOUND, "Transaction not found", AppErrorCode.TransactionNotFound);

    // Mengizinkan pending & paid
    appAssert(
      ["pending", "paid"].includes(transaction.status),
      BAD_REQUEST,
      "Transaction cannot be modified",
      AppErrorCode.InvalidTransactionStatus
    );

    // Check if file exists - using appAssert instead of returning directly
    appAssert(
      req.file,
      BAD_REQUEST,
      "Payment proof file required",
      AppErrorCode.FileUploadRequired
    );

    // Set payment proof path and update status
    transaction.paymentProof = `/uploads/${req.file.filename}`;
    if (transaction.status === "pending") {
      transaction.status = "pending"; // Tetap pending jika awalnya pending
    }

    await transaction.save({ session });
    await session.commitTransaction();

    console.log("Transaction updated successfully:", {
      id: transaction._id,
      status: transaction.status,
      proof: transaction.paymentProof
    });

    res.status(OK).json({
      _id: transaction._id,
      status: transaction.status,
      paymentProof: transaction.paymentProof
    });

  } catch (error: any) {
    console.error("Error in uploadProofHandler:", error);
    await session.abortTransaction();
    // Penanganan error upload file
    if (error.errorCode === AppErrorCode.FileUploadRequired) {
      return res.status(BAD_REQUEST).json({
        message: error.message,
        errorCode: error.errorCode,
      });
    }

    // Penanganan error lainnya
    return res.status(error.statusCode || INTERNAL_SERVER_ERROR).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  } finally {
    session.endSession();
  }
};

export const getAllTickets: RequestHandler = async (req, res, next) => {
  try {
    const tickets = await TicketModel.find({}, "_id eventName category price stock status" );

    res.status(OK).json({
      message: "Data Successfully Retrieved",
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTicketDetail: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await TicketModel.findById(id);

    res.status(OK).json({
      message: "Data Successfully Retrieved",
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error); // Debugging
    next(error);
  }
};

export const getUserTransactions: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;

    const transactions = await TransactionModel.find({
      userId: userId,
      status: "paid", // Filter transaksi dengan status "paid"
    }).populate("tickets.ticketId"); // Populate detail tiket

    res.status(OK).json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Gagal mengambil transaksi pengguna." });
  }
};

const updateTransactionSchema = z.object({
  status: z.enum(["pending", "paid", "reject"]), // Validasi status
});

export const updateTransactionUserHandler: RequestHandler = async (req, res) => {
  try {
      const { id } = req.params;
      const validatedData = updateTransactionSchema.parse(req.body);
      const { status } = validatedData;
      const paymentProof = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updateFields: any = { status };
      if (paymentProof) {
          updateFields.paymentProof = paymentProof;
      }

      const transaction = await TransactionModel.findByIdAndUpdate(
          id,
          updateFields,
          { new: true }
      );

      if (!transaction) {
          res.status(NOT_FOUND).json({ message: "Transaksi tidak ditemukan" });
      }

      res.status(OK).json(transaction);
  } catch (error: any) {
      if (error instanceof z.ZodError) {
          res.status(BAD_REQUEST).json({ message: "Validasi gagal", errors: error.message});
      }
      console.error("Gagal mengupdate transaksi:", error);
      res.status(INTERNAL_SERVER_ERROR).json({ message: "Gagal mengupdate transaksi", error: error.message });
  }
};


export const archivedTransaction: RequestHandler = async (req: any, res: any) => {
  try {
    const { transactionId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await TransactionModel.findById(transactionId)
        .populate("tickets.ticketId")
        .session(session);

      if (!transaction) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "Transaksi tidak ditemukan" });
      }

      const archivedTransaction = new ArchivedTransactionModel({
        userId: transaction.userId,
        tickets: transaction.tickets,
        totalTicket: transaction.totalTicket,
        totalPrice: transaction.totalPrice,
        status: transaction.status,
        transactionMethod: transaction.transactionMethod,
        expiredAt: transaction.expiredAt,
        paymentProof: transaction.paymentProof,
        originalTransactionId: transaction._id,
      });

      await archivedTransaction.save({ session });

      const bulkTicketOps = transaction.tickets.map((ticket) => ({
        updateOne: {
          filter: { _id: ticket.ticketId },
          update: { $inc: { stock: 1 } },
        },
      }));

      if (bulkTicketOps.length > 0) {
        await TicketModel.bulkWrite(bulkTicketOps, { session });
      }

      await TransactionModel.findByIdAndDelete(transactionId).session(session);

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message:
          "Transaksi berhasil diarsipkan dan stok tiket dikembalikan",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error dalam transaksi:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error archiving transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengarsipkan transaksi",
      error: error,
    });
  }
};

export const restoreArchivedTransaction: RequestHandler = async (req: any, res: any) => {
  try {
    const { transactionId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const archivedTransaction = await ArchivedTransactionModel.findById(transactionId)
        .populate("tickets.ticketId")
        .session(session);

      if (!archivedTransaction) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ success: false, message: "Transaksi Diarsipkan tidak ditemukan" });
      }

      const transaction = new TransactionModel({
        userId: archivedTransaction.userId,
        tickets: archivedTransaction.tickets,
        totalTicket: archivedTransaction.totalTicket,
        totalPrice: archivedTransaction.totalPrice,
        status: archivedTransaction.status,
        transactionMethod: archivedTransaction.transactionMethod,
        expiredAt: archivedTransaction.expiredAt,
        paymentProof: archivedTransaction.paymentProof,
      });

      await transaction.save({ session });

      const bulkTicketOps = archivedTransaction.tickets.map((ticket) => ({
        updateOne: {
          filter: { _id: ticket.ticketId },
          update: { $inc: { stock: -1 } },
        },
      }));

      if (bulkTicketOps.length > 0) {
        await TicketModel.bulkWrite(bulkTicketOps, { session });
      }

      await ArchivedTransactionModel.findByIdAndDelete(transactionId).session(session);

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Transaksi berhasil dikembalikan ke transaksi aktif dan stok tiket diperbarui",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error dalam transaksi:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error restoring archived transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengembalikan transaksi Diarsipkan",
      error: error,
    });
  }
};

// Get archived transaction by ID
export const getArchivedTransactionById: RequestHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid archived transaction ID format"
      });
    }

    const archivedTransaction = await ArchivedTransactionModel.findById(id)
      .populate("userId", "name email")
      .populate("tickets.ticketId", "name price stock");

    if (!archivedTransaction) {
      return res.status(404).json({
        success: false,
        message: "Archived transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      data: archivedTransaction
    });
  } catch (error) {
    console.error("Error fetching archived transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch archived transaction",
      error: error
    });
  }
};

// Get all archived transactions
export const getAllArchivedTransactions: RequestHandler = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page as string);
    let limit = parseInt(req.query.limit as string);
    const status = req.query.status as string;
    let search = req.query.search as string;
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;
    const ticketId = req.query.ticketId as string;

    page = (!isNaN(page) && page > 0) ? page : 1;
    limit = (!isNaN(limit) && limit > 0) ? limit : 10;

    const skip = (page - 1) * limit;

    let filter: any = {};
    let sort: any = {};

    if (status) {
      filter.status = status;
    }

    if (ticketId) {
      filter['tickets.ticketId'] = ticketId;
    }

    if (search) {
      console.log("Search parameter:", search);
      search = search.trim();

      const matchingUsers = await UserModel.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      const isNumericSearch = !isNaN(Number(search));

      if (userIds.length > 0) {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { userId: { $in: userIds } },
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      } else {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      }
    }

    console.log("Filter created:", filter);

    if (sortBy) {
      const validSortFields = ["createdAt", "userId.name", "transactionMethod", "totalPrice", "paymentProof", "fullname"];
      if (validSortFields.includes(sortBy)) {
        if (sortBy === "fullname") {
          sort["userId.profile.fullname"] = sortOrder === "asc" ? 1 : -1;
        } else {
          sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        }
      } else {
        sort["createdAt"] = -1;
      }
    } else {
      sort["createdAt"] = -1;
    }

    const totalDocs = await ArchivedTransactionModel.countDocuments(filter);

    const archivedTransactions = await ArchivedTransactionModel.find(filter)
      .populate({
        path: "userId",
        select: "name email createdAt paymentProof profile",
        populate: {
          path: "profile",
          select: "fullname",
        },
      })
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Archived Transactions Retrieved Successfully",
      data: archivedTransactions,
      pagination: {
        total: totalDocs,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalDocs / limit),
      },
    });
  } catch (error) {
    console.error("Error in getAllArchivedTransactions:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};


export const updateArchivedTransactionStatus: RequestHandler = async (req: any, res: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "paid", "cancelled"].includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'paid', or 'cancelled'"
      });
    }

    // Find the archived transaction
    const archivedTransaction = await ArchivedTransactionModel.findById(id).session(session);

    if (!archivedTransaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Archived transaction not found"
      });
    }

    // Update status
    archivedTransaction.status = status;
    await archivedTransaction.save({ session });

    // If status is 'paid', restore to Transaction model and update ticket stock
    if (status === "paid") {
      // Create a new transaction
      const newTransaction = new TransactionModel({
        userId: archivedTransaction.userId,
        tickets: archivedTransaction.tickets,
        totalTicket: archivedTransaction.totalTicket,
        totalPrice: archivedTransaction.totalPrice,
        status: "paid",
        transactionMethod: archivedTransaction.transactionMethod,
        expiredAt: archivedTransaction.expiredAt,
        paymentProof: archivedTransaction.paymentProof
      });

      await newTransaction.save({ session });

      // Update ticket stock - increment by the quantity in this transaction
      // Group tickets by ticketId to calculate total quantity per ticket type
      const ticketCounts: Record<string, number> = {};

      archivedTransaction.tickets.forEach(ticket => {
        const ticketId = ticket.ticketId.toString();
        if (!ticketCounts[ticketId]) {
          ticketCounts[ticketId] = 0;
        }
        ticketCounts[ticketId] += 1;
      });

      // Update each ticket's stock
      for (const [ticketId, count] of Object.entries(ticketCounts)) {
        await TicketModel.findByIdAndUpdate(
          ticketId,
          { $inc: { stock: -count } }, // Note: Using negative count because we're taking tickets from stock
          { session }
        );
      }

      // Delete the archived transaction
      await ArchivedTransactionModel.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Transaction confirmed, restored to active transactions, and stock updated",
        data: newTransaction
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Archived transaction status updated to ${status}`,
      data: archivedTransaction
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating archived transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update archived transaction",
      error: error
    });
  }
};

export const regenerateTicketImagesHandler: RequestHandler = async (req: any, res: any, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    // Validate transactionId format
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid transaction ID format"
      });
    }

    // Find the transaction
    const transaction = await TransactionModel.findById(transactionId).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(NOT_FOUND).json({
        message: "Transaction not found"
      });
    }

    // Get tickets with populated event info for regeneration
    const ticketIds = transaction.tickets.map(t => t.ticketId);
    const ticketsInfo = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate('eventName')
      .session(session);

    // Create a map for easy lookup
    const ticketInfoMap = new Map();
    ticketsInfo.forEach(t => ticketInfoMap.set(t._id.toString(), t));

    // Ensure uploads directories exist
    const uploadsDir = path.join(__dirname, '../../uploads/tickets');
    const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

    // Create directories if they don't exist
    [uploadsDir, qrCodesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Track success/failure for each ticket
    const results: {
      success: number;
      failed: number;
      tickets: Array<{ uniqueTicketId: mongoose.Types.ObjectId; qrCode: string; ticketImage: string }>
    } = { success: 0, failed: 0, tickets: [] };

    // Process each ticket in the transaction
    const updatedTickets = await Promise.all(transaction.tickets.map(async (ticket) => {
      try {
        // Delete old ticket image file if it exists
        if (ticket.ticketImage && !ticket.ticketImage.startsWith('data:')) {
          const oldPath = path.join(__dirname, '../../', ticket.ticketImage.replace(/^\//, ''));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Delete old QR code file if it exists
        if (ticket.qrCode && !ticket.qrCode.startsWith('data:')) {
          const oldQrPath = path.join(__dirname, '../../', ticket.qrCode.replace(/^\//, ''));
          if (fs.existsSync(oldQrPath)) {
            fs.unlinkSync(oldQrPath);
          }
        }

        // Get original QR code data (the ObjectId string)
        const qrCodeData = ticket.uniqueTicketId.toString();

        console.log("QR Code Data (regenerateTicketImagesHandler):", qrCodeData);

        // Get ticket details
        const ticketInfo = ticketInfoMap.get(ticket.ticketId.toString());
        if (!ticketInfo) {
          console.warn(`Ticket info not found for ${ticket.ticketId}`);
        }

        // Generate QR code as dataURL
        const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 200
        });

        // Create a unique filename for the QR code
        const timestamp = new Date().getTime();
        const qrCodeFileName = `qr-${ticket.uniqueTicketId}-${timestamp}.png`;
        const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

        // Convert base64 QR code data to image file and save it
        const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

        // Create URL path for QR code to be stored in database
        const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

        // Prepare ticket data for image generation
        const ticketData = {
          eventName: ticketInfo?.eventName?.name || "Melophile Festival",
          category: ticketInfo?.category || "General",
          date: '13 Mei 2025'
        };

        // Generate new ticket image with template using the QR code file path
        const ticketImageBase64 = await generateTicketImage(ticketData, qrCodeFilePath);

        // Create a unique filename for the ticket image
        const ticketFileName = `ticket-${ticket.uniqueTicketId}-${timestamp}.jpg`;
        const ticketFilePath = path.join(uploadsDir, ticketFileName);

        // Convert base64 data to image file and save it
        const ticketBase64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(ticketFilePath, ticketBase64Data, 'base64');

        // Create URL path to be stored in database
        const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

        results.success++;
        results.tickets.push({
          uniqueTicketId: ticket.uniqueTicketId,
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        });

        // Return updated ticket object with new image URLs
        return {
          ...ticket, // Keep existing ticket properties
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        };
      } catch (error) {
        console.error(`Error regenerating ticket ${ticket.uniqueTicketId}:`, error);
        results.failed++;
        // Return original ticket if regeneration fails
        return ticket;
      }
    }));

    // Update transaction with new ticket images
    transaction.tickets = updatedTickets;
    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(OK).json({
      message: "Ticket images regenerated successfully",
      stats: {
        total: updatedTickets.length,
        success: results.success,
        failed: results.failed
      },
      tickets: results.tickets
    });

  } catch (error) {
    console.error("Error regenerating ticket images:", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Failed to regenerate ticket images",
      error: error
    });
  }
};

export const regenerateTicketImagesHandler2: RequestHandler = async (req: any, res: any, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    // Validate transactionId format
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid transaction ID format"
      });
    }

    // Find the transaction
    const transaction = await TransactionModel.findById(transactionId).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(NOT_FOUND).json({
        message: "Transaction not found"
      });
    }

    // Get tickets with populated event info for regeneration
    const ticketIds = transaction.tickets.map(t => t.ticketId);
    const ticketsInfo = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate('eventName')
      .session(session);

    // Create a map for easy lookup
    const ticketInfoMap = new Map();
    ticketsInfo.forEach(t => ticketInfoMap.set(t._id.toString(), t));

    // Ensure uploads directories exist
    const uploadsDir = path.join(__dirname, '../../uploads/tickets');
    const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

    // Create directories if they don't exist
    [uploadsDir, qrCodesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Track success/failure for each ticket
    const results: {
      success: number;
      failed: number;
      tickets: Array<{ uniqueTicketId: mongoose.Types.ObjectId; qrCode: string; ticketImage: string }>
    } = { success: 0, failed: 0, tickets: [] };

    // Process each ticket in the transaction
    const updatedTickets = await Promise.all(transaction.tickets.map(async (ticket) => {
      try {
        // Delete old ticket image file if it exists
        if (ticket.ticketImage && !ticket.ticketImage.startsWith('data:')) {
          const oldPath = path.join(__dirname, '../../', ticket.ticketImage.replace(/^\//, ''));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Delete old QR code file if it exists
        if (ticket.qrCode && !ticket.qrCode.startsWith('data:')) {
          const oldQrPath = path.join(__dirname, '../../', ticket.qrCode.replace(/^\//, ''));
          if (fs.existsSync(oldQrPath)) {
            fs.unlinkSync(oldQrPath);
          }
        }

        // Get original QR code data (the ObjectId string)
        const qrCodeData = ticket.uniqueTicketId.toString();

        console.log("QR Code Data (regenerateTicketImagesHandler):", qrCodeData);

        // Get ticket details
        const ticketInfo = ticketInfoMap.get(ticket.ticketId.toString());
        if (!ticketInfo) {
          console.warn(`Ticket info not found for ${ticket.ticketId}`);
        }

        // Generate QR code as dataURL
        const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 200
        });

        // Create a unique filename for the QR code
        const timestamp = new Date().getTime();
        const qrCodeFileName = `qr-${ticket.uniqueTicketId}-${timestamp}.png`;
        const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

        // Convert base64 QR code data to image file and save it
        const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

        // Create URL path for QR code to be stored in database
        const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

        // Prepare ticket data for image generation
        const ticketData = {
          eventName: ticketInfo?.eventName?.name || "Melophile Festival",
          category: ticketInfo?.category || "General",
          date: '13 Mei 2025'
        };

        // Generate new ticket image with template using the QR code file path
        const ticketImageBase64 = await generateTicketImage2(ticketData, qrCodeFilePath);

        // Create a unique filename for the ticket image
        const ticketFileName = `ticket-${ticket.uniqueTicketId}-${timestamp}.jpg`;
        const ticketFilePath = path.join(uploadsDir, ticketFileName);

        // Convert base64 data to image file and save it
        const ticketBase64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(ticketFilePath, ticketBase64Data, 'base64');

        // Create URL path to be stored in database
        const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

        results.success++;
        results.tickets.push({
          uniqueTicketId: ticket.uniqueTicketId,
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        });

        // Return updated ticket object with new image URLs
        return {
          ...ticket, // Keep existing ticket properties
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        };
      } catch (error) {
        console.error(`Error regenerating ticket ${ticket.uniqueTicketId}:`, error);
        results.failed++;
        // Return original ticket if regeneration fails
        return ticket;
      }
    }));

    // Update transaction with new ticket images
    transaction.tickets = updatedTickets;
    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(OK).json({
      message: "Ticket images regenerated successfully",
      stats: {
        total: updatedTickets.length,
        success: results.success,
        failed: results.failed
      },
      tickets: results.tickets
    });

  } catch (error) {
    console.error("Error regenerating ticket images:", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Failed to regenerate ticket images",
      error: error
    });
  }
};

export const regenerateTicketImagesHandler3: RequestHandler = async (req: any, res: any, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    // Validate transactionId format
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid transaction ID format"
      });
    }

    // Find the transaction
    const transaction = await TransactionModel.findById(transactionId).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(NOT_FOUND).json({
        message: "Transaction not found"
      });
    }

    // Get tickets with populated event info for regeneration
    const ticketIds = transaction.tickets.map(t => t.ticketId);
    const ticketsInfo = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate('eventName')
      .session(session);

    // Create a map for easy lookup
    const ticketInfoMap = new Map();
    ticketsInfo.forEach(t => ticketInfoMap.set(t._id.toString(), t));

    // Ensure uploads directories exist
    const uploadsDir = path.join(__dirname, '../../uploads/tickets');
    const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

    // Create directories if they don't exist
    [uploadsDir, qrCodesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Track success/failure for each ticket
    const results: {
      success: number;
      failed: number;
      tickets: Array<{ uniqueTicketId: mongoose.Types.ObjectId; qrCode: string; ticketImage: string }>
    } = { success: 0, failed: 0, tickets: [] };

    // Process each ticket in the transaction
    const updatedTickets = await Promise.all(transaction.tickets.map(async (ticket) => {
      try {
        // Delete old ticket image file if it exists
        if (ticket.ticketImage && !ticket.ticketImage.startsWith('data:')) {
          const oldPath = path.join(__dirname, '../../', ticket.ticketImage.replace(/^\//, ''));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Delete old QR code file if it exists
        if (ticket.qrCode && !ticket.qrCode.startsWith('data:')) {
          const oldQrPath = path.join(__dirname, '../../', ticket.qrCode.replace(/^\//, ''));
          if (fs.existsSync(oldQrPath)) {
            fs.unlinkSync(oldQrPath);
          }
        }

        // Get original QR code data (the ObjectId string)
        const qrCodeData = ticket.uniqueTicketId.toString();

        console.log("QR Code Data (regenerateTicketImagesHandler):", qrCodeData);

        // Get ticket details
        const ticketInfo = ticketInfoMap.get(ticket.ticketId.toString());
        if (!ticketInfo) {
          console.warn(`Ticket info not found for ${ticket.ticketId}`);
        }

        // Generate QR code as dataURL
        const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 200
        });

        // Create a unique filename for the QR code
        const timestamp = new Date().getTime();
        const qrCodeFileName = `qr-${ticket.uniqueTicketId}-${timestamp}.png`;
        const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

        // Convert base64 QR code data to image file and save it
        const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

        // Create URL path for QR code to be stored in database
        const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

        // Prepare ticket data for image generation
        const ticketData = {
          eventName: ticketInfo?.eventName?.name || "Melophile Festival",
          category: ticketInfo?.category || "General",
          date: '13 Mei 2025'
        };

        // Generate new ticket image with template using the QR code file path
        const ticketImageBase64 = await generateTicketImage3(ticketData, qrCodeFilePath);

        // Create a unique filename for the ticket image
        const ticketFileName = `ticket-${ticket.uniqueTicketId}-${timestamp}.jpg`;
        const ticketFilePath = path.join(uploadsDir, ticketFileName);

        // Convert base64 data to image file and save it
        const ticketBase64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(ticketFilePath, ticketBase64Data, 'base64');

        // Create URL path to be stored in database
        const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

        results.success++;
        results.tickets.push({
          uniqueTicketId: ticket.uniqueTicketId,
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        });

        // Return updated ticket object with new image URLs
        return {
          ...ticket, // Keep existing ticket properties
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        };
      } catch (error) {
        console.error(`Error regenerating ticket ${ticket.uniqueTicketId}:`, error);
        results.failed++;
        // Return original ticket if regeneration fails
        return ticket;
      }
    }));

    // Update transaction with new ticket images
    transaction.tickets = updatedTickets;
    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(OK).json({
      message: "Ticket images regenerated successfully",
      stats: {
        total: updatedTickets.length,
        success: results.success,
        failed: results.failed
      },
      tickets: results.tickets
    });

  } catch (error) {
    console.error("Error regenerating ticket images:", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Failed to regenerate ticket images",
      error: error
    });
  }
};
export const regenerateTicketImagesHandler4: RequestHandler = async (req: any, res: any, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    // Validate transactionId format
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid transaction ID format"
      });
    }

    // Find the transaction
    const transaction = await TransactionModel.findById(transactionId).session(session);
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(NOT_FOUND).json({
        message: "Transaction not found"
      });
    }

    // Get tickets with populated event info for regeneration
    const ticketIds = transaction.tickets.map(t => t.ticketId);
    const ticketsInfo = await TicketModel.find({ _id: { $in: ticketIds } })
      .populate('eventName')
      .session(session);

    // Create a map for easy lookup
    const ticketInfoMap = new Map();
    ticketsInfo.forEach(t => ticketInfoMap.set(t._id.toString(), t));

    // Ensure uploads directories exist
    const uploadsDir = path.join(__dirname, '../../uploads/tickets');
    const qrCodesDir = path.join(__dirname, '../../uploads/qrcodes');

    // Create directories if they don't exist
    [uploadsDir, qrCodesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Track success/failure for each ticket
    const results: {
      success: number;
      failed: number;
      tickets: Array<{ uniqueTicketId: mongoose.Types.ObjectId; qrCode: string; ticketImage: string }>
    } = { success: 0, failed: 0, tickets: [] };

    // Process each ticket in the transaction
    const updatedTickets = await Promise.all(transaction.tickets.map(async (ticket) => {
      try {
        // Delete old ticket image file if it exists
        if (ticket.ticketImage && !ticket.ticketImage.startsWith('data:')) {
          const oldPath = path.join(__dirname, '../../', ticket.ticketImage.replace(/^\//, ''));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Delete old QR code file if it exists
        if (ticket.qrCode && !ticket.qrCode.startsWith('data:')) {
          const oldQrPath = path.join(__dirname, '../../', ticket.qrCode.replace(/^\//, ''));
          if (fs.existsSync(oldQrPath)) {
            fs.unlinkSync(oldQrPath);
          }
        }

        // Get original QR code data (the ObjectId string)
        const qrCodeData = ticket.uniqueTicketId.toString();

        console.log("QR Code Data (regenerateTicketImagesHandler):", qrCodeData);

        // Get ticket details
        const ticketInfo = ticketInfoMap.get(ticket.ticketId.toString());
        if (!ticketInfo) {
          console.warn(`Ticket info not found for ${ticket.ticketId}`);
        }

        // Generate QR code as dataURL
        const qrCodeDataURL = await qrcode.toDataURL(qrCodeData, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 200
        });

        // Create a unique filename for the QR code
        const timestamp = new Date().getTime();
        const qrCodeFileName = `qr-${ticket.uniqueTicketId}-${timestamp}.png`;
        const qrCodeFilePath = path.join(qrCodesDir, qrCodeFileName);

        // Convert base64 QR code data to image file and save it
        const qrBase64Data = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(qrCodeFilePath, qrBase64Data, 'base64');

        // Create URL path for QR code to be stored in database
        const qrCodeUrl = `/uploads/qrcodes/${qrCodeFileName}`;

        // Prepare ticket data for image generation
        const ticketData = {
          eventName: ticketInfo?.eventName?.name || "Melophile Festival",
          category: ticketInfo?.category || "General",
          date: '13 Mei 2025'
        };

        // Generate new ticket image with template using the QR code file path
        const ticketImageBase64 = await generateTicketImage4(ticketData, qrCodeFilePath);

        // Create a unique filename for the ticket image
        const ticketFileName = `ticket-${ticket.uniqueTicketId}-${timestamp}.jpg`;
        const ticketFilePath = path.join(uploadsDir, ticketFileName);

        // Convert base64 data to image file and save it
        const ticketBase64Data = ticketImageBase64.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(ticketFilePath, ticketBase64Data, 'base64');

        // Create URL path to be stored in database
        const ticketFileUrl = `/uploads/tickets/${ticketFileName}`;

        results.success++;
        results.tickets.push({
          uniqueTicketId: ticket.uniqueTicketId,
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        });

        // Return updated ticket object with new image URLs
        return {
          ...ticket, // Keep existing ticket properties
          qrCode: qrCodeUrl,
          ticketImage: ticketFileUrl
        };
      } catch (error) {
        console.error(`Error regenerating ticket ${ticket.uniqueTicketId}:`, error);
        results.failed++;
        // Return original ticket if regeneration fails
        return ticket;
      }
    }));

    // Update transaction with new ticket images
    transaction.tickets = updatedTickets;
    await transaction.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(OK).json({
      message: "Ticket images regenerated successfully",
      stats: {
        total: updatedTickets.length,
        success: results.success,
        failed: results.failed
      },
      tickets: results.tickets
    });

  } catch (error) {
    console.error("Error regenerating ticket images:", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: "Failed to regenerate ticket images",
      error: error
    });
  }
};


export const statsCountHandler: RequestHandler = async (req, res) => {
  try {
    const { status, search, ticketId } = req.query;

    const filter: Record<string, any> = {};

    if (status) filter.status = status;

    // Handle search conditions
    if (search) {
      filter.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } },
        { transactionMethod: { $regex: search, $options: 'i' } }
      ];
    }

    // Create the aggregation pipeline with proper typing
    const pipeline: any[] = [
      { $match: filter }
    ];

    // Add ticket filtering if ticketId is provided
    if (ticketId && typeof ticketId === 'string') {
      try {
        const objectId = new mongoose.Types.ObjectId(ticketId);

        // Add a filter to only include transactions that have this ticket ID
        pipeline.push(
          {
            $match: {
              "tickets.ticketId": objectId
            }
          }
        );
      } catch (error) {
        res.status(400).json({ message: "Invalid ticketId" });
        return;
      }
    }

    // Add the final grouping stage to calculate totals
    pipeline.push({
      $group: {
        _id: null,
        totalTickets: { $sum: "$totalTicket" },
        totalPrice: { $sum: "$totalPrice" }
      }
    });

    const stats = await TransactionModel.aggregate(pipeline);

    const result = stats.length > 0 ? {
      totalTickets: stats[0].totalTickets,
      totalPrice: stats[0].totalPrice
    } : {
      totalTickets: 0,
      totalPrice: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik transaksi' });
  }
};

export const genderStatsCountHandler: RequestHandler = async (req: any, res: any) => {
  try {
    const { status, search, ticketId } = req.query;

    const filter: Record<string, any> = {};

    if (status) filter.status = status;

    // Handle search conditions
    if (search) {
      const matchingUsers = await UserModel.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      }).select("_id");
      const userIds = matchingUsers.map((user) => user._id);
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search as string);

      filter.$or = [
        ...(isValidObjectId ? [{ _id: search }] : []),
        { userId: { $in: userIds } },
        { transactionMethod: { $regex: search, $options: 'i' } },
      ];
    }

    // Add ticket filtering if ticketId is provided
    if (ticketId && typeof ticketId === 'string') {
      try {
        const objectId = new mongoose.Types.ObjectId(ticketId);
        filter["tickets.ticketId"] = objectId;
      } catch (error) {
        return res.status(400).json({ message: "Invalid ticketId" });
      }
    }

    // Pipeline untuk aggregate
    const genderStats = await TransactionModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.profile.gender',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' },
          totalTickets: { $sum: '$totalTicket' }
        },
      },
      {
        $group: { // Tahap grouping baru untuk mendapatkan total keseluruhan
          _id: null,
          maleCount: { $sum: { $cond: [ { $eq: [ "$_id", "male" ] }, "$count", 0 ] } },
          femaleCount: { $sum: { $cond: [ { $eq: [ "$_id", "female" ] }, "$count", 0 ] } },
          totalAmount: { $sum: "$totalAmount" },
          totalTickets: { $sum: "$totalTickets" }
        }
      },
      {
        $project: {
          _id: 0,
          maleStats: { count: '$maleCount' },
          femaleStats: { count: '$femaleCount' },
          totalStats: { totalAmount: '$totalAmount', totalTickets: '$totalTickets' }
        }
      }
    ]);

    const result = genderStats.length > 0 ? genderStats[0] : {
      maleStats: { count: 0 },
      femaleStats: { count: 0 },
      totalStats: { totalAmount: 0, totalTickets: 0 }
    };

    res.json({
      maleStats: {
        count: result.maleStats?.count || 0,
        percentage: result.totalStats?.totalTickets > 0
        ? (((result.maleStats?.count || 0) / result.totalStats.totalTickets) * 100).toFixed(2)
        : "0",
        totalAmount: result.totalStats?.totalAmount || 0,
        totalTickets: result.totalStats?.totalTickets || 0
      },
      femaleStats: {
        count: result.femaleStats?.count || 0,
        percentage: result.totalStats?.totalTickets > 0
        ? String((((result.femaleStats?.count || 0) / result.totalStats.totalTickets) * 100).toFixed(2))
        : "0",
        totalAmount: result.totalStats?.totalAmount || 0,
        totalTickets: result.totalStats?.totalTickets || 0
      },
      totalStats: {
        count: (result.maleStats?.count || 0) + (result.femaleStats?.count || 0),
        totalAmount: result.totalStats?.totalAmount || 0,
        totalTickets: result.totalStats?.totalTickets || 0
      }
    });
  } catch (error) {
    console.error('Error getting gender stats:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil statistik gender' });
  }
};

export const exportAllTransactions: RequestHandler = async (req, res, next) => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;
    const ticketId = req.query.ticketId as string;

    let filter: any = {};

    // Filter status
    if (status) {
      filter.status = status;
    }

    // Filter ticketId
    if (ticketId) {
      filter['tickets.ticketId'] = ticketId;
    }

    // Logika search sama seperti di getAllTransactions
    if (search) {
      const matchingUsers = await UserModel.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((user) => user._id);

      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      const isNumericSearch = !isNaN(Number(search));

      if (userIds.length > 0) {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { userId: { $in: userIds } },
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      } else {
        filter.$or = [
          ...(isValidObjectId ? [{ _id: search }] : []),
          { transactionMethod: { $regex: search, $options: "i" } },
          ...(isNumericSearch ? [{ totalPrice: Number(search) }] : []),
        ];
      }
    }

    // Fetch semua transaksi tanpa pagination
    const transactions = await TransactionModel.find(filter)
      .populate({
        path: "userId",
        select: "name email",
      });

    res.status(200).json({
      message: "Transactions Exported Successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error in exportAllTransactions:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
