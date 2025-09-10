import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../lib/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // validasi sederhana
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password wajib diisi" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (:name,:email,:hash)",
      { name, email, hash }
    );

    return res.status(201).json({ id: result.insertId, name, email });
  } catch (e) {
    // mapping error biar jelas
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }
    if (e && e.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ error: "Tabel users belum ada. Jalankan db.sql" });
    }
    if (e && e.code === "ER_BAD_DB_ERROR") {
      return res.status(500).json({ error: "Database tidak ditemukan. Cek DB_NAME di .env" });
    }
    if (e && e.code === "ECONNREFUSED") {
      return res.status(500).json({ error: "Tidak bisa konek ke MySQL. Cek service & kredensial" });
    }

    console.error("Register error:", e); // tetap log lengkap di server
    return res.status(500).json({ error: "Gagal register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email=:email", { email });
    if (!rows.length) return res.status(400).json({ error: "User tidak ditemukan" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal login" });
  }
};
