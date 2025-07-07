// backend/routes/marca.routes.js

const express = require('express');
const router = express.Router();
const Marca = require('../models/Marca');
const Modelo = require('../models/Modelo');  // <-- Importa el modelo

// Listar todas las marcas
router.get('/', async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.send(marcas);
  } catch (err) {
    console.error('Error listando marcas:', err);
    res.status(500).send(err);
  }
});

// Agregar una nueva marca
router.post('/', async (req, res) => {
  try {
    const nuevaMarca = await Marca.create({ name: req.body.name });
    res.send(nuevaMarca);
  } catch (err) {
    console.error('Error creando marca:', err);
    res.status(500).send(err);
  }
});

// Eliminar una marca y todos sus modelos asociados
router.delete('/:id', async (req, res) => {
  const marcaId = req.params.id;
  try {
    // 1) Elimina la marca
    const marca = await Marca.findByIdAndDelete(marcaId);
    if (!marca) {
      return res.status(404).send({ error: 'Marca no encontrada' });
    }

    // 2) Elimina en cascada todos los modelos de esa marca
    const result = await Modelo.deleteMany({ marca: marcaId });
    console.log(`Borrados ${result.deletedCount} modelos de la marca "${marca.name}"`);

    // 3) Respuesta 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    console.error('Error eliminando marca y modelos asociados:', err);
    res.status(500).send(err);
  }
});

module.exports = router;
