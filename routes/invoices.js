const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function (req, res, next) {
    try {
        let results = await db.query('SELECT * FROM invoices');

        return res.json({ 'invoices': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let { id } = req.params;
        let results = await db.query('SELECT * FROM invoices WHERE id=$1', [id]);

        return res.json({ 'invoice': results.rows });
    } catch (e) {

    }
});

router.post('/', async function (req, res, next) {
    try {
        let { comp_code, amt } = req.body;
        let paid = req.body.paid || false;
        let paid_date = req.body.paid_date || null;
        let results = await db.query('INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES ($1, $2, $3, $4) RETURNING *', [comp_code, amt, paid, paid_date]);

        return res.json({ 'invoice': results.rows });

    } catch (e) {
        return next(e);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let { id } = req.params;
        let { amt } = req.body;
        let results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *', [amt, id]);

        return res.json({ 'invoice': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let { id } = req.params;
        let results = db.query('DELETE FROM invoices WHERE id=$1', [id]);

        return res.json({ 'status': 'deleted' });
    } catch (e) {
        return next(e);
    }
});








module.exports = router;