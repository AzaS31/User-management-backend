const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    async create({ name, email, password }) {
        const hashed = await bcrypt.hash(password, 10); 
        
        // note: new users are created with status "unverified" by default
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, status, created_at)
       VALUES (?, ?, ?, 'unverified', NOW())`,
            [name, email, hashed]
        );
        return result.insertId;
    },

    async findByEmail(email) {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows[0];
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        return rows[0];
    },

    async updateStatus(id, status) {
        await pool.query(`UPDATE users SET status = ? WHERE id = ?`, [status, id]);
    },

    async updateLastLogin(id) {
        await pool.query(`UPDATE users SET last_login = NOW() WHERE id = ?`, [id]);
    },

    async delete(id) {
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
    },

    async getAll() {
        const [rows] = await pool.query(`
      SELECT id, name, email, last_login, status 
      FROM users 
      ORDER BY last_login DESC
    `);
        return rows;
    },
};

module.exports = User;
