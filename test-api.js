const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let createdProfileId = null;
let createdExperienceId = null;

// Fonction utilitaire pour les requêtes HTTP avec logging
async function makeRequest(method, endpoint, data = null) {
  try {
    console.log(`\n${method} ${endpoint}`);
    console.log('Données envoyées:', data);
    
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log('Statut:', response.status);
    console.log('Réponse:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('ERREUR:', error.response ? error.response.status : error.message);
    console.error('Détails:', error.response ? JSON.stringify(error.response.data, null, 2) : 'Pas de détails');
    return null;
  }
}

// Tests des routes de profil
async function testProfiles() {
  console.log('\n=== TEST DES ROUTES DE PROFIL ===');
  
  // 1. Créer un profil
  console.log('\n--> Test: Création d\'un profil');
  const profileData = {
    name: 'Jean Test',
    email: `jean.test.${Date.now()}@example.com` // Email unique avec timestamp
  };
  
  const createdProfile = await makeRequest('post', '/profiles', profileData);
  if (createdProfile) {
    createdProfileId = createdProfile._id;
    console.log('Profil créé avec ID:', createdProfileId);
  }
  
  // 2. Récupérer tous les profils
  console.log('\n--> Test: Récupération de tous les profils');
  await makeRequest('get', '/profiles');
  
  // 3. Récupérer un profil par ID
  if (createdProfileId) {
    console.log('\n--> Test: Récupération d\'un profil par ID');
    await makeRequest('get', `/profiles/${createdProfileId}`);
    
    // 4. Mettre à jour un profil
    console.log('\n--> Test: Mise à jour d\'un profil');
    const updateData = {
      name: 'Jean Test Modifié',
      email: `jean.modifie.${Date.now()}@example.com`
    };
    await makeRequest('put', `/profiles/${createdProfileId}`, updateData);
  }
}

// Tests des routes d'expérience
async function testExperiences() {
  if (!createdProfileId) {
    console.log('\nImpossible de tester les expériences: aucun profil créé');
    return;
  }
  
  console.log('\n=== TEST DES ROUTES D\'EXPÉRIENCE ===');
  
  // 1. Ajouter une expérience
  console.log('\n--> Test: Ajout d\'une expérience');
  const experienceData = {
    titre: 'Développeur Full-Stack',
    entreprise: 'Tech Solutions',
    dates: '2020-2023',
    description: 'Développement d\'applications web avec Node.js et MongoDB'
  };
  
  const profileWithExp = await makeRequest('post', `/profiles/${createdProfileId}/experience`, experienceData);
  if (profileWithExp && profileWithExp.experience && profileWithExp.experience.length > 0) {
    createdExperienceId = profileWithExp.experience[0]._id;
    console.log('Expérience créée avec ID:', createdExperienceId);
  }
  
  // 2. Supprimer une expérience
  if (createdExperienceId) {
    console.log('\n--> Test: Suppression d\'une expérience');
    await makeRequest('delete', `/profiles/${createdProfileId}/experience/${createdExperienceId}`);
  }
}

// Tests des routes de compétences
async function testSkills() {
  if (!createdProfileId) {
    console.log('\nImpossible de tester les compétences: aucun profil créé');
    return;
  }
  
  console.log('\n=== TEST DES ROUTES DE COMPÉTENCES ===');
  
  // 1. Ajouter une compétence
  console.log('\n--> Test: Ajout d\'une compétence');
  const skillData = {
    skill: 'MongoDB'
  };
  
  await makeRequest('post', `/profiles/${createdProfileId}/skills`, skillData);
  
  // 2. Ajouter une autre compétence
  console.log('\n--> Test: Ajout d\'une autre compétence');
  const anotherSkillData = {
    skill: 'Express.js'
  };
  
  await makeRequest('post', `/profiles/${createdProfileId}/skills`, anotherSkillData);
  
  // 3. Supprimer une compétence
  console.log('\n--> Test: Suppression d\'une compétence');
  await makeRequest('delete', `/profiles/${createdProfileId}/skills/MongoDB`);
}

// Tests des routes d'information
async function testInformation() {
  if (!createdProfileId) {
    console.log('\nImpossible de tester les informations: aucun profil créé');
    return;
  }
  
  console.log('\n=== TEST DES ROUTES D\'INFORMATION ===');
  
  // Mettre à jour les informations
  console.log('\n--> Test: Mise à jour des informations');
  const infoData = {
    bio: 'Développeur passionné par les technologies web',
    localisation: 'Paris, France',
    siteWeb: 'https://example.com'
  };
  
  await makeRequest('put', `/profiles/${createdProfileId}/information`, infoData);
}

// Test de suppression (soft delete)
async function testDelete() {
  if (!createdProfileId) {
    console.log('\nImpossible de tester la suppression: aucun profil créé');
    return;
  }
  
  console.log('\n=== TEST DE SUPPRESSION ===');
  
  // Supprimer un profil (soft delete)
  console.log('\n--> Test: Suppression d\'un profil (soft delete)');
  await makeRequest('delete', `/profiles/${createdProfileId}`);
  
  // Vérifier que le profil n'est plus accessible
  console.log('\n--> Test: Vérification que le profil n\'est plus accessible');
  await makeRequest('get', `/profiles/${createdProfileId}`);
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('=== DÉBUT DES TESTS DE L\'API ===');
  
  await testProfiles();
  await testExperiences();
  await testSkills();
  await testInformation();
  await testDelete();
  
  console.log('\n=== FIN DES TESTS DE L\'API ===');
}

// Exécuter tous les tests
runAllTests(); 