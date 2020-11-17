const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//
// Mostrar todas las categorías
//
app.get('/categoria', (req, res) => {

    // let soloActivos = { estado: true };

    Categoria.find({})
        // .skip(desde)
        // .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email') // rellena los id con los usuarios correspondientes
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});


//
// Mostrar una categoría por ID
//
app.get('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id incorrecto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });

    });

});


//
// Crear una nueva categoria
//
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoría
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });



});


//
// Actualizar una categoría por ID
//
app.put('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);



    // Categoria.findById(id, (err, categoriaDB) => {

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });
    // })

});



//
// eliminar una categoría por ID
//
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admin puede borrar una categoria
    // categoria.findByIDAndRemove();

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        // Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        });

    });


});

module.exports = app;