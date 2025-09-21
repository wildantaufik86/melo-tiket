import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import {NODE_ENV, PORT } from "./constants/env";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.routes";
import { createServer } from "http";
import ticketRoutes from "./routes/ticket.routes";
import profileRoutes from "./routes/profile.routes";
import eventRoutes from "./routes/event.routes";
import transactionRoutes from "./routes/transaction.routes";
import categoryRoutes from "./routes/category.routes";


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

app.use("/ticket", express.json(), express.urlencoded({ extended: true }), ticketRoutes);
app.use("/transaction", express.json(), express.urlencoded({ extended: true }), transactionRoutes);
app.use("/event", express.json(), express.urlencoded({ extended: true }), eventRoutes);
app.use("/profile", express.json(), express.urlencoded({ extended: true }), profileRoutes);
app.use("/categories", express.json(), express.urlencoded({ extended: true }), categoryRoutes);
app.use("/auth", express.json(), express.urlencoded({ extended: true }), authRoutes);
app.use("/user", express.json(), express.urlencoded({ extended: true }), userRoutes);

app.use(errorHandler);

const server = createServer(app);

server.listen(PORT, async () => {
  console.log(`[OK] ✅ Server listening on port: ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
