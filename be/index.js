import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import loanRoutes from "./src/routes/loanRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve cover
app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/loans", loanRoutes);

app.get("/", (req, res) => res.json({ ok: true, msg: "Perpustakaan Online API" }));

app.listen(process.env.PORT, () => {
  console.log("Server running at http://localhost:" + process.env.PORT);
});
