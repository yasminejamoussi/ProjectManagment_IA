// backend/controllers/userController.test.js
const request = require('supertest');
const app = require('../src/server');  // Assurez-vous que votre app Express est exportée correctement
const mongoose = require('mongoose');
const User = require('../src/models/User');  // Modèle utilisateur
const dotenv = require('dotenv');

// Charger les variables d'environnement spécifiques aux tests
dotenv.config({ path: '.env.test' });

// Se connecter à une base de données de test avant d'exécuter les tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/projectmanagement_test';  // URI de la base de données de test
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Déconnecter de la base de données après chaque test
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Registration', () => {
  it('should register a new user', async () => {
    const userData = {
      firstname: "John",
      lastname: "Doe",
      phone: "223456789",
      email: "jo@example.com",
      password: "password123",
    };

    const response = await request(app).post('/api/auth/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user).toHaveProperty('email', userData.email);
  });

  it('should not register a user with an existing email', async () => {
    const userData = {
      firstname: "Jane",
      lastname: "Doe",
      phone: "987654321",
      email: "jo@example.com",  // Utiliser un email déjà existant
      password: "password123",
    };

    const response = await request(app).post('/api/auth/register').send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });
});
