const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Descripción necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectID,
        ref: 'Usuario'
    },
});


module.exports = mongoose.model('Categoria', categoriaSchema);