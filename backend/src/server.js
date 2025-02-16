var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config(); // Charger les variables d'environnement depuis .env

var app = express();

// Utilisation des middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connexion à MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/projectmanagement"; // Utiliser la variable d'environnement pour MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestion des erreurs
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Rendre la page d'erreur
  res.status(err.status || 500);
  res.render('error');
});

// Définir le port d'écoute (par défaut 4000 ou celui spécifié dans .env)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

module.exports = app;
