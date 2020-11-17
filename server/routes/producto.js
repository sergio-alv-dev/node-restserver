const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


//==========================
//  Obtener todos los productos
//==========================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email') // rellena los id con los usuarios correspondientes
        .populate('categoria', 'descripcion') // rellena los id con su característica correspondiente
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        })

});


//==========================
//  Obtener un producto por id
//==========================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario , categoria

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id incorrecto producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            });

        });

});


//==========================
//  buscar productos
//==========================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });

});



//==========================
//  crear un nuevo producto
//==========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});


//==========================
// actualizar el producto
//==========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado
    let id = req.params.id;
    let body = req.body;

    // Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;


        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no pudo ser creadi'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

//==========================
// borrar un producto
//==========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // disponible : false

    let id = req.params.id;
    let cambiaEstado = {
            disponible: false
        }
        // Producto.findByIdAndRemove(id, (err, productoBorrado) => {
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'producto Borrado',
            producto: productoBorrado,
        });

    });
});












module.exports = app;