const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res, next) {
    try {
        let results = await db.query('SELECT * FROM industries');
        return res.json({ 'industries': results.rows });
    } catch (e) {
        return next(e);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { industry_code, industry_name } = req.body;
        let results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *', [industry_code, industry_name]);

        return res.json({ 'industry': results.rows });

    } catch (e) {
        return next(e);
    }
})



module.exports = router;