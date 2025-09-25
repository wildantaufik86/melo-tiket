import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";
import { projectRoot } from "../utils/path";

type UploaderOptions = {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
};

const DEFAULT_MIME = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif"
];

export default function createUploader(folderName: string, options: UploaderOptions = {}): Multer {
  const uploadsDir = path.join(projectRoot, `uploads/${folderName}`);

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  const allowed = options.allowedMimeTypes ?? DEFAULT_MIME;
  const limits = {
    fileSize: options.maxFileSize ?? 5 * 1024 * 1024,
    files: 10,
  };

  return multer({
    storage,
    limits,
    fileFilter: (_req, file, cb) => {
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const error: any = new Error("Only images (JPEG, PNG, JPG, WEBP, GIF) are allowed");
        error.code = "INVALID_FILE_TYPE";
        cb(error, false);
      }
    },
  });
}
