import React from 'react';
import Layout from '../components/layout/Layout';
import PatientForm from '../components/patient/PatientForm';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const NewPatient: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/patients');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserPlus className="h-6 w-6 mr-2 text-blue-600" />
          Register New Patient
        </h1>
        <p className="text-gray-600">
          Fill in the patient details to register them and create a health card.
        </p>
      </div>

      <Card>
        <PatientForm onSuccess={handleSuccess} />
      </Card>
    </Layout>
  );
};

export default NewPatient;