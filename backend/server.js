import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/openapi.json" with { type: "json" };

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use("/", authRoutes);

app.use("/", noteRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/openapi.json", (req, res) => {
  res.json(swaggerDocument);
});

app.get("/about", (req, res) => {
  res.json({
    name: "Goli Asrit Vardhan",
    email: "your_email@gmail.com",

    "my features": {
      "Pinned Notes":
        "Users can pin important notes for quick access.",

      "Priority Levels":
        "Allows users to organize notes based on urgency.",

      "Search Notes":
        "Users can quickly search notes using keywords.",
    },
  });
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});