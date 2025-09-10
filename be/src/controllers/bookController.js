import fs from "fs";
import path from "path";
import { pool } from "../lib/db.js";

function safeUnlink(file) {
  if (!file) return;
  const full = path.join("public/assets", file);
  fs.existsSync(full) && fs.unlinkSync(full);
}

export const listBooks = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM v_books_overview ORDER BY title");
  res.json(rows);
};

export const getBook = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM books WHERE id=:id", { id: req.params.id });
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
};

export const createBook = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { title, description, authors = [], categories = [] } = req.body;
    const cover = req.file?.filename || null;

    // 1. Insert buku
    const [result] = await conn.query(
      "INSERT INTO books (title, description, cover_file) VALUES (:title,:description,:cover)",
      { title, description, cover }
    );
    const bookId = result.insertId;

    // 2. Relasi ke authors (kalau ada)
    if (Array.isArray(authors)) {
      for (let authorId of authors) {
        await conn.query(
          "INSERT INTO book_authors (book_id, author_id) VALUES (:bookId,:authorId)",
          { bookId, authorId }
        );
      }
    }

    // 3. Relasi ke categories (kalau ada)
    if (Array.isArray(categories)) {
      for (let categoryId of categories) {
        await conn.query(
          "INSERT INTO book_categories (book_id, category_id) VALUES (:bookId,:categoryId)",
          { bookId, categoryId }
        );
      }
    }

    await conn.commit();
    res.status(201).json({ id: bookId, title, description, cover, authors, categories });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ error: "Gagal tambah buku" });
  } finally {
    conn.release();
  }
};


export const updateBook = async (req, res) => {
  const [rows] = await pool.query("SELECT cover_file FROM books WHERE id=:id", { id: req.params.id });
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const old = rows[0].cover_file;
  const { title, description } = req.body;
  const cover = req.file?.filename || old;

  await pool.query(
    "UPDATE books SET title=COALESCE(:title,title), description=COALESCE(:description,description), cover_file=:cover WHERE id=:id",
    { id: req.params.id, title, description, cover }
  );

  if (req.file && old && old !== cover) safeUnlink(old);
  res.json({ updated: true });
};

export const deleteBook = async (req, res) => {
  const [rows] = await pool.query("SELECT cover_file FROM books WHERE id=:id", { id: req.params.id });
  if (!rows.length) return res.status(404).json({ error: "Not found" });

  const cover = rows[0].cover_file;
  await pool.query("DELETE FROM books WHERE id=:id", { id: req.params.id });
  if (cover) safeUnlink(cover);

  res.json({ deleted: true });
};
