// backend/routes/modelo.routes.js

const express = require('express');
const router = express.Router();
const Modelo = require('../models/Modelo');

/**
 * GET /api/modelos
 * Lista todos los modelos, opcionalmente filtrados por marca:
 *   /api/modelos?marca=<marcaId>
 */
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.marca) {
      filtro.marca = req.query.marca;
    }
    // Si quisieras también poblar la marca con su nombre:
    // .populate('marca', 'name')
    const modelos = await Modelo.find(filtro);
    res.send(modelos);
  } catch (err) {
    console.error('Error listando modelos:', err);
    res.status(500).send(err);
  }
});

/**
 * POST /api/modelos
 * Crea un nuevo modelo. Body: { name: String, marca: ObjectId }
 */
router.post('/', async (req, res) => {
  try {
    const { name, marca } = req.body;
    const nuevoModelo = await Modelo.create({ name, marca });
    res.status(201).send(nuevoModelo);
  } catch (err) {
    console.error('Error creando modelo:', err);
    res.status(500).send(err);
  }
});

/**
 * PUT /api/modelos/:id
 * Actualiza solo el nombre de un modelo existente.
 */
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Modelo.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!actualizado) {
      return res.status(404).send({ error: 'Modelo no encontrado' });
    }
    res.send(actualizado);
  } catch (err) {
    console.error('Error actualizando modelo:', err);
    res.status(500).send(err);
  }
});

/**
 * DELETE /api/modelos/:id
 * Elimina un modelo por su ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Modelo.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).send({ error: 'Modelo no encontrado' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Error eliminando modelo:', err);
    res.status(500).send(err);
  }
});

module.exports = router;
