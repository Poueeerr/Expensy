const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    database: 'userexpenses',
    password: 'postgres'
})
module.exports = pool;