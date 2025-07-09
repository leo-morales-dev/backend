// backend/routes/modelo.routes.js

const express = require('express');
const router  = express.Router();
const Modelo  = require('../models/Modelo');
const Auto    = require('../models/Auto'); // Para contar referencias

/**
 * GET /api/modelos
 * Lista todos los modelos, opcionalmente filtrados por marca:
 *   /api/modelos?marca=<marcaId>
 */
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.marca) filtro.marca = req.query.marca;
    const modelos = await Modelo.find(filtro).populate('marca', 'name');
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
 * Actualiza sólo el nombre de un modelo existente.
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
 * Sólo elimina el modelo si NO está siendo usado por ningún Auto.
 */
router.delete('/:id', async (req, res) => {
  const modeloId = req.params.id;
  try {
    // 1. Verificar si hay autos que lo referencian
    const count = await Auto.countDocuments({ modelo: modeloId });
    if (count > 0) {
      return res
        .status(400)
        .send({ error: 'No se puede eliminar: hay autos asignados a este modelo.' });
    }
    // 2. Si no hay referencias, eliminar
    const eliminado = await Modelo.findByIdAndDelete(modeloId);
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
