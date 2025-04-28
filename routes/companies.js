const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res, next) {
    try {
        let results = await db.query('SELECT code, name FROM companies');
        return res.json({ 'companies': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.get('/:code', async function (req, res, next) {
    try {
        let { code } = req.params
        let results = await db.query('SELECT * FROM companies WHERE code=$1', [code]);
        return res.json({ 'company': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let { code, name, description } = req.body;
        let results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);

        return res.json({ 'company': results.rows });


    } catch (e) {
        return next(e);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        let { code } = req.params;
        let { name, description } = req.body;
        let results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *', [name, description, code]);

        return res.json({ 'company': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.delete('/:code', async function (req, res, next) {
    try {
        let { code } = req.params;
        let results = db.query('DELETE FROM companies WHERE code=$1', [code]);
        return res.json({ 'status': 'deleted' });
    } catch (e) {
        return next(e);
    }
})



module.exports = router;