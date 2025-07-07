// backend/routes/auto.routes.js

const express = require('express');
const autoRutas = express.Router();
const Auto = require('../models/Auto');

/**
 * POST /api/agregar
 * Crea un nuevo auto con { marca, modelo, anio, precio } en el body.
 */
autoRutas.post('/agregar', async (req, res) => {
  try {
    const nuevo = await Auto.create(req.body);
    console.log('Se insertó un auto correctamente:', nuevo);
    res.status(201).send(nuevo);
  } catch (error) {
    console.error('Error creando auto:', error);
    res.status(500).send(error);
  }
});

/**
 * GET /api/autos
 * Devuelve todos los autos, poblados con name de marca y modelo.
 */
autoRutas.get('/autos', async (req, res) => {
  try {
    const lista = await Auto.find()
      .populate('marca', 'name')
      .populate('modelo', 'name');
    res.send(lista);
  } catch (error) {
    console.error('Error listando autos:', error);
    res.status(500).send(error);
  }
});

/**
 * GET /api/auto/:id
 * Devuelve un solo auto (poblado) por su ID.
 */
autoRutas.get('/auto/:id', async (req, res) => {
  try {
    const item = await Auto.findById(req.params.id)
      .populate('marca', 'name')
      .populate('modelo', 'name');
    if (!item) return res.status(404).send({ message: 'Auto no encontrado' });
    res.send(item);
  } catch (error) {
    console.error('Error obteniendo auto:', error);
    res.status(500).send(error);
  }
});

/**
 * PUT /api/actualizar/:id
 * Actualiza todos los campos de un auto y devuelve el documento poblado.
 */
autoRutas.put('/actualizar/:id', async (req, res) => {
  try {
    const actualizado = await Auto.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('marca', 'name')
      .populate('modelo', 'name');
    if (!actualizado) return res.status(404).send({ message: 'Auto no encontrado' });
    console.log('Se actualizó el auto correctamente:', actualizado);
    res.send(actualizado);
  } catch (error) {
    console.error('Error actualizando auto:', error);
    res.status(500).send(error);
  }
});

/**
 * PATCH /api/disponible/:id
 * Cambia solo el estado 'disponible' de un auto y devuelve el documento poblado.
 */
autoRutas.patch('/disponible/:id', async (req, res) => {
  try {
    const actualizado = await Auto.findByIdAndUpdate(
      req.params.id,
      { $set: { disponible: req.body.disponible } },
      { new: true }
    )
      .populate('marca', 'name')
      .populate('modelo', 'name');
    if (!actualizado) return res.status(404).send({ message: 'Auto no encontrado' });
    console.log(`Se marcó auto ${req.params.id} como ${actualizado.disponible ? 'disponible' : 'vendido'}`);
    res.send(actualizado);
  } catch (error) {
    console.error('Error marcando disponible/vendido:', error);
    res.status(500).send(error);
  }
});

/**
 * DELETE /api/eliminar/:id
 * Elimina un auto por su ID.
 */
autoRutas.delete('/eliminar/:id', async (req, res) => {
  try {
    const eliminado = await Auto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).send({ message: 'Auto no encontrado' });
    console.log('Se eliminó el auto correctamente:', eliminado);
    res.send(eliminado);
  } catch (error) {
    console.error('Error eliminando auto:', error);
    res.status(500).send(error);
  }
});

module.exports = autoRutas;
