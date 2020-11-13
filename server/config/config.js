/**
 * 
 *  
 */

// =========
// Puerto
// =========
process.env.PORT = process.env.PORT || 3000;


// =========
// Entorno
// =========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========
// vencimiento del token
// =========
// 60 seg * 60 min * 24 hr * 30 d

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========
// seed de autenticación
// =========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// =========
// BD
// =========

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db-cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;