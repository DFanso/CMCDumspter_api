import express from "express";
import * as mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { errorMiddleware } from "./middleware/errorMiddleware";

import authRoutes from "./routes/auth";
import adminRoutes from "./routes/adminRoutes";
import articleRoutes from "./routes/articleRoutes";
import incidentRoutes from "./routes/incidentRoutes";

dotenv.config();

const app = express();
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI!, { retryWrites: true, w: "majority" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/incident", incidentRoutes);

app.use(errorMiddleware);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
