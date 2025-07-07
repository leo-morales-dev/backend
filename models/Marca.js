// backend/models/Marca.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarcaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // esto garantiza que no se repita
    trim: true
  }
}, {
  collection: 'marcas'
});

module.exports = mongoose.model('Marca', MarcaSchema);
