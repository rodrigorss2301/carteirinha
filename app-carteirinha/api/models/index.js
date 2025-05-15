
const sequelize = require('../config/database');
const Patient = require('./Patient');
const HealthCard = require('./HealthCard');

const models = {
  Patient,
  HealthCard
};

// Sincroniza todos os modelos com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

syncDatabase();

module.exports = models;
