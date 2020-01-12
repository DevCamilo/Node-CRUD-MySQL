const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

// No soporta promesas, solo código de Call Backs...
const pool = mysql.createPool(database);

pool.getConnection((err, con) => {
    if (err) {
        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                console.error('DATABASE CONNECTION WAS CLOSED');
                break;
            case 'ER_CON_COUNT_ERROR':
                console.error('DATABASE HAS TO MANY CONNECTIONS');
                break;
            case 'ECONNREFUSED':
                console.error('DATABASE CONNECTION WAS REFUSED');
            default:
                console.error(err.code)
                break;
        }
    } else if (con) {
        con.release();
        console.log('Conexion DB Exitosa');
        return; 
    }
});

// Permite convertir Call Backs a funciones asíncronas
pool.query = promisify(pool.query);

module.exports = pool;