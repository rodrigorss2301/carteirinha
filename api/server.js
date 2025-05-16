const express = require('express');
const cors = require('cors');
const { Patient, HealthCard } = require('./models');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Rota para listar todos os pacientes
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [HealthCard]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar um paciente específico
app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [HealthCard]
    });
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todas as carteirinhas
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await HealthCard.findAll({
      include: [Patient]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
