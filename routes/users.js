const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Get All Users
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Create a User
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Get a Single User by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Update a User
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Delete a User
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;