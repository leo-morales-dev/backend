// backend/models/Auto.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoSchema = new Schema({
  marca: {
    type: Schema.Types.ObjectId,
    ref: 'Marca',
    required: true
  },
  modelo: {
    type: Schema.Types.ObjectId,
    ref: 'Modelo',
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'autos'
});

module.exports = mongoose.model('Auto', AutoSchema);
