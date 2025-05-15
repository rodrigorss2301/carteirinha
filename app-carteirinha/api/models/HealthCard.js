const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const HealthCard = sequelize.define('HealthCard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cardNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  validUntil: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active'
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Definindo o relacionamento
HealthCard.belongsTo(Patient);
Patient.hasMany(HealthCard);

module.exports = HealthCard;
