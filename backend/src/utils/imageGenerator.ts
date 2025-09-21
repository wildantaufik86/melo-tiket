
import path from 'path';
import fs from 'fs/promises';
import { createCanvas} from 'canvas';
import { loadImage } from 'canvas';
import AppError from './appError';
import { INTERNAL_SERVER_ERROR } from '../constants/http';
import { registerFont } from 'canvas';

export async function generateTicketImage(
  ticketData: any,
  qrCodeImagePath: string,
  templatePath: string
): Promise<string> {
  try {
    const templateFileName = path.basename(templatePath, path.extname(templatePath));
    const layoutPath = path.join(__dirname, `../../public/layouts/${templateFileName}.json`);

    const layoutConfig = JSON.parse(await fs.readFile(layoutPath, 'utf-8'));
    const [templateImage, qrImage] = await Promise.all([
      loadImage(templatePath),
      loadImage(qrCodeImagePath)
    ]);

    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(templateImage, 0, 0);

    const { qrCode } = layoutConfig;
    ctx.drawImage(qrImage, qrCode.x, qrCode.y, qrCode.width, qrCode.height);

    for (const key in ticketData) {
      if (layoutConfig[key]) {
        const element = layoutConfig[key];
        ctx.font = element.font;
        ctx.fillStyle = element.fillStyle;
        ctx.textAlign = element.textAlign || 'left';
        ctx.fillText(ticketData[key], element.x, element.y);
      }
    }

    return canvas.toDataURL('image/jpeg', 0.9);

  } catch (error) {
    console.error('Error generating dynamic ticket image:', error);
    throw new AppError(INTERNAL_SERVER_ERROR, "Failed to generate ticket image.");
  }
}
