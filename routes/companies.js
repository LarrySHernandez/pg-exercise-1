const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res, next) {
    try {
        let results1 = await db.query('SELECT c.code, c.name, c.description, i.industry FROM companies as c LEFT JOIN company_industry ON company_code=c.code LEFT JOIN industries AS i ON i.code=industry_code ');
        let industries = results1.rows.map(r => r.industry);
        let { code, name, description } = results1.rows[0]
        let results2 = { code, name, description, "industries": industries }
        return res.json({ 'companies': results2 });
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
        let industry_code = req.body.industry_code || null;
        let results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
        if (industry_code) {
            let results2 = await db.query('INSERT INTO company_industry (company_code, industry_code) VALUES ($1, $2)', [code, industry_code]);
        }
        return res.json({ 'company': results.rows });


    } catch (e) {
        return next(e);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        let { code } = req.params;
        let { name, description } = req.body;
        let industry_code = req.body.industry_code || null;
        let results3 = await db.query('SELECT * FROM company_industry WHERE company_code=$1 AND industry_code=$2', [code, industry_code]);
        if (industry_code && results3.rows.length === 0) {
            let results2 = await db.query('INSERT INTO company_industry (company_code, industry_code) VALUES ($1, $2)', [code, industry_code]);
        }
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