const Profile = require('./model');

// Récupérer tous les profils
exports.getAllProfiles = async (req, res) => {
  try {
    // Recherche et filtres bonus
    const { skills, localisation, search } = req.query;
    let query = { active: true };
    
    // Filtre par compétences
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    // Filtre par localisation
    if (localisation) {
      query['information.localisation'] = new RegExp(localisation, 'i');
    }
    
    // Recherche par nom ou email
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    const profiles = await Profile.find(query);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau profil
exports.createProfile = async (req, res) => {
  const { name, email } = req.body;
  
  try {
    // Vérifier si le profil existe déjà
    let profile = await Profile.findOne({ email });
    
    if (profile) {
      return res.status(400).json({ message: 'Profil avec cet email existe déjà' });
    }
    
    // Créer un nouveau profil
    profile = new Profile({
      name,
      email
    });
    
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un profil par ID
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  
  try {
    let profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    // Vérifier si l'email existe déjà pour un autre profil
    if (email && email !== profile.email) {
      const existingProfile = await Profile.findOne({ email });
      if (existingProfile) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }
    
    profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email } },
      { new: true }
    );
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un profil par ID (soft delete)
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    // Soft delete (mettre active à false)
    await Profile.findByIdAndUpdate(req.params.id, { active: false });
    
    res.json({ message: 'Profil supprimé' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une expérience à un profil
exports.addExperience = async (req, res) => {
  const { titre, entreprise, dates, description } = req.body;
  
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    const newExp = {
      titre,
      entreprise,
      dates,
      description
    };
    
    profile.experience.unshift(newExp);
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une expérience d'un profil
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    // Trouver l'index de l'expérience à supprimer
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp);
    
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Expérience non trouvée' });
    }
    
    // Supprimer l'expérience
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil ou expérience non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une compétence à un profil
exports.addSkill = async (req, res) => {
  const { skill } = req.body;
  
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    // Vérifier si la compétence existe déjà
    if (profile.skills.includes(skill)) {
      return res.status(400).json({ message: 'Compétence déjà présente' });
    }
    
    profile.skills.push(skill);
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une compétence d'un profil
exports.deleteSkill = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    const skill = req.params.skill;
    
    // Vérifier si la compétence existe
    const removeIndex = profile.skills.indexOf(skill);
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }
    
    // Supprimer la compétence
    profile.skills.splice(removeIndex, 1);
    await profile.save();
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour les informations d'un profil
exports.updateInformation = async (req, res) => {
  const { bio, localisation, siteWeb } = req.body;
  
  try {
    let profile = await Profile.findById(req.params.id);
    
    if (!profile || !profile.active) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    
    profile = await Profile.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'information.bio': bio || profile.information.bio,
          'information.localisation': localisation || profile.information.localisation,
          'information.siteWeb': siteWeb || profile.information.siteWeb
        }
      },
      { new: true }
    );
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 