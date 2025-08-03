import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import { APP_ORIGIN, FE_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.routes";
import authenticate from "./middleware/authenticate";
import path from "path";
import adminRoutes from "./routes/admin.routes";
import { createServer } from "http";
import { generateTicketImage, getAllTicketDetail, getAllTickets } from "./controllers/transaction.controller";
import operatorRoutes from "./routes/operator.routes";

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5000",
  "http://localhost:3000",

  // Production - sesuai dengan server_name di Nginx
  "http://melophilefestival.com",
  "https://melophilefestival.com",
  "http://www.melophilefestival.com",
  "https://www.melophilefestival.com"
];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: function (origin, callback) {
      // Untuk requests tanpa origin (seperti dari Postman atau curl)
      if (!origin) {
          return callback(null, true);
      }

      // Check if origin is in allowedOrigins
      if (allowedOrigins.includes(origin)) {
          return callback(null, true);
      }

      // Log origin yang ditolak untuk debugging
      console.log(`Rejected origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(cookieParser());

app.get("/", ({ req, res }: any) => {
  return res.status(OK).json({
    status: "Perfectly Connected",
  });
});
app.get("/tickets", getAllTickets);
app.get("/tickets/:id", getAllTicketDetail);
app.use("/admin", adminRoutes);
app.use("/operator", operatorRoutes);

app.use("/auth", authRoutes);


app.use("/user", authenticate, userRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

const server = createServer(app);

server.listen(PORT, async () => {
  console.log(`[OK] ✅ Server listening on port: ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
