// backend/routes/marca.routes.js

const express = require('express');
const router  = express.Router();
const Marca   = require('../models/Marca');
const Auto    = require('../models/Auto'); // Para contar referencias

/**
 * GET /api/marcas
 * Listar todas las marcas.
 */
router.get('/', async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.send(marcas);
  } catch (err) {
    console.error('Error listando marcas:', err);
    res.status(500).send(err);
  }
});

/**
 * POST /api/marcas
 * Crear una nueva marca.
 */
router.post('/', async (req, res) => {
  try {
    const nuevaMarca = await Marca.create({ name: req.body.name });
    res.status(201).send(nuevaMarca);
  } catch (err) {
    console.error('Error creando marca:', err);
    res.status(500).send(err);
  }
});

/**
 * DELETE /api/marcas/:id
 * Sólo elimina la marca si NO está siendo usada por ningún Auto.
 */
router.delete('/:id', async (req, res) => {
  const marcaId = req.params.id;
  try {
    // 1. Verificar si hay autos que la referencian
    const count = await Auto.countDocuments({ marca: marcaId });
    if (count > 0) {
      return res
        .status(400)
        .send({ error: 'No se puede eliminar: hay autos asignados a esta marca.' });
    }
    // 2. Si no hay referencias, eliminar
    const eliminado = await Marca.findByIdAndDelete(marcaId);
    if (!eliminado) {
      return res.status(404).send({ error: 'Marca no encontrada' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Error eliminando marca:', err);
    res.status(500).send(err);
  }
});

module.exports = router;
