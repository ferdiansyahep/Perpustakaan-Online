import { pool } from "../lib/db.js";

export const borrowBook = async (req, res) => {
  const { copy_id, due_at } = req.body;
  const user_id = req.user.id;
  await pool.query(
    "INSERT INTO loans (user_id, copy_id, due_at) VALUES (:user_id,:copy_id,:due_at)",
    { user_id, copy_id, due_at }
  );
  await pool.query("UPDATE copies SET status='BORROWED' WHERE id=:id", { id: copy_id });
  res.json({ borrowed: true });
};

export const returnBook = async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE loans SET status='RETURNED', returned_at=NOW() WHERE id=:id", { id });
  const [rows] = await pool.query("SELECT copy_id FROM loans WHERE id=:id", { id });
  if (rows.length) {
    await pool.query("UPDATE copies SET status='AVAILABLE' WHERE id=:id", { id: rows[0].copy_id });
  }
  res.json({ returned: true });
};

export const listLoans = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM loans WHERE user_id=:id ORDER BY loaned_at DESC", { id: req.user.id });
  res.json(rows);
};
