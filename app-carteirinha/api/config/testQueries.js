const { Patient, HealthCard } = require('../models');

async function testQueries() {
  try {
    // Buscar todos os pacientes
    const patients = await Patient.findAll({
      include: [HealthCard]
    });

    console.log('\nTodos os pacientes com suas carteirinhas:');
    patients.forEach(patient => {
      console.log('\nPaciente:', {
        id: patient.id,
        name: patient.name,
        cpf: patient.cpf,
        email: patient.email,
        carteirinhas: patient.HealthCards.map(card => ({
          cardNumber: card.cardNumber,
          status: card.status,
          validUntil: card.validUntil
        }))
      });
    });

    // Buscar carteirinhas ativas
    const activeCards = await HealthCard.findAll({
      where: { status: 'active' },
      include: [Patient]
    });

    console.log('\nCarteirinhas ativas:');
    activeCards.forEach(card => {
      console.log({
        cardNumber: card.cardNumber,
        validUntil: card.validUntil,
        paciente: card.Patient.name
      });
    });

  } catch (error) {
    console.error('Erro ao testar queries:', error);
  }
}

testQueries();
