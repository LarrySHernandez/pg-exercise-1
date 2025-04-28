/** Database setup for BizTime. */
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'larryh2612',
    password: 'Lobster_123',
    database: 'biztime',
    host: 'localhost',
    port: 5432
});


module.exports = pool;