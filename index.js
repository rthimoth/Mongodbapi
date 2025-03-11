const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongodb');
const routes = require('./routes');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Connecter à MongoDB
connectDB();

// Middleware pour parser le JSON
app.use(express.json({ extended: false }));

// Routes
app.use('/api', routes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API MongoDB avec Mongoose' });
});

// Port par défaut
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 