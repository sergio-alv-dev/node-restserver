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
// BD
// =========

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db-cafe'
} else {
    urlDB = 'mongodb+srv://killgorito:jBX15rmNj2Rkrply@cluster0.snbaj.mongodb.net/db-cafe';
}

process.env.URLDB = urlDB;