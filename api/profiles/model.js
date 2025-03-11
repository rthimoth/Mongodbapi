const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma d'expérience
const ExperienceSchema = new Schema({
  titre: {
    type: String,
    required: true
  },
  entreprise: {
    type: String,
    required: true
  },
  dates: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

// Schéma de profil utilisateur
const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  experience: [ExperienceSchema],
  skills: [String],
  information: {
    bio: String,
    localisation: String,
    siteWeb: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);