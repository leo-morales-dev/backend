// backend/models/Modelo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModeloSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del modelo es obligatorio']
  },
  marca: {
    type: Schema.Types.ObjectId,
    ref: 'Marca',
    required: [true, 'La referencia a la marca es obligatoria']
  }
}, {
  collection: 'modelos'
});

module.exports = mongoose.model('Modelo', ModeloSchema);
