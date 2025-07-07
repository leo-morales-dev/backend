// backend/server.js

const express     = require('express');
const mongoose    = require('mongoose');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const createError = require('http-errors');

// URI de conexión desde variable de entorno
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('ERROR: la variable MONGODB_URI no está definida.');
  process.exit(1);
}

// Conexión con la BD usando la URI de Atlas
mongoose
  .connect(mongoUri)
  .then(x => console.log(`Conectado a la BD: ${x.connections[0].name}`))
  .catch(err => console.error('Error en la conexión:', err));

// Importar rutas
const autoRutas   = require('./routes/auto.routes');
const marcaRutas  = require('./routes/marca.routes');
const modeloRutas = require('./routes/modelo.routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Montar las rutas
app.use('/api',        autoRutas);    // POST /api/agregar, GET /api/autos, etc.
app.use('/api/marcas',  marcaRutas);   // GET/POST/DELETE marcas
app.use('/api/modelos', modeloRutas);  // GET/POST/PUT/DELETE modelos

// 404 para rutas no definidas
app.use((req, res, next) => next(createError(404)));

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.message });
});

// Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Servidor backend escuchando en el puerto ${port}`)
);
