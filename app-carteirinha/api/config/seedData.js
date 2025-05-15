const { Patient, HealthCard } = require('../models');

async function seedDatabase() {
  try {
    // Criar alguns pacientes de teste
    const patients = await Patient.bulkCreate([
      {
        name: 'João Silva',
        cpf: '12345678901',
        birthDate: '1990-01-15',
        email: 'joao.silva@email.com',
        phone: '11999998888',
        address: 'Rua A, 123 - São Paulo, SP'
      },
      {
        name: 'Maria Santos',
        cpf: '98765432101',
        birthDate: '1985-06-22',
        email: 'maria.santos@email.com',
        phone: '11977776666',
        address: 'Av. B, 456 - São Paulo, SP'
      },
      {
        name: 'Pedro Oliveira',
        cpf: '45678912301',
        birthDate: '1995-12-03',
        email: 'pedro.oliveira@email.com',
        phone: '11955554444',
        address: 'Rua C, 789 - São Paulo, SP'
      }
    ]);

    // Criar carteirinhas para os pacientes
    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));

    for (const patient of patients) {
      await HealthCard.create({
        cardNumber: `CARD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        validUntil: oneYearFromNow,
        status: 'active',
        patientId: patient.id
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
