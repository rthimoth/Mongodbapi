const express = require('express');
const router = express.Router();
const profileController = require('./controller');

// @route   GET /profiles
// @desc    Récupérer tous les profils
// @access  Public
router.get('/', profileController.getAllProfiles);

// @route   GET /profiles/:id
// @desc    Récupérer un profil par ID
// @access  Public
router.get('/:id', profileController.getProfileById);

// @route   POST /profiles
// @desc    Créer un nouveau profil
// @access  Public
router.post('/', profileController.createProfile);

// @route   PUT /profiles/:id
// @desc    Mettre à jour un profil par ID
// @access  Public
router.put('/:id', profileController.updateProfile);

// @route   DELETE /profiles/:id
// @desc    Supprimer un profil par ID (soft-delete)
// @access  Public
router.delete('/:id', profileController.deleteProfile);

// @route   POST /profiles/:id/experience
// @desc    Ajouter une expérience à un profil
// @access  Public
router.post('/:id/experience', profileController.addExperience);

// @route   DELETE /profiles/:id/experience/:exp
// @desc    Supprimer une expérience d'un profil
// @access  Public
router.delete('/:id/experience/:exp', profileController.deleteExperience);

// @route   POST /profiles/:id/skills
// @desc    Ajouter une compétence à un profil
// @access  Public
router.post('/:id/skills', profileController.addSkill);

// @route   DELETE /profiles/:id/skills/:skill
// @desc    Supprimer une compétence d'un profil
// @access  Public
router.delete('/:id/skills/:skill', profileController.deleteSkill);

// @route   PUT /profiles/:id/information
// @desc    Mettre à jour les informations d'un profil
// @access  Public
router.put('/:id/information', profileController.updateInformation);

module.exports = router; 