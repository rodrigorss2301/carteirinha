import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HealthCard from '../components/card/HealthCard';
import Button from '../components/ui/Button';
import { usePatients } from '../context/PatientContext';
import { ArrowLeft, User, AlertCircle } from 'lucide-react';

const PatientCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient } = usePatients();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(getPatient(id || ''));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 rounded-full p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-6">The patient you're looking for doesn't exist.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/patients')}
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Back to Patients
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </button>

        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <User className="h-6 w-6 mr-2 text-blue-600" />
          {patient.name}'s Health Card
        </h1>
        <p className="text-gray-600">
          Digital health card for member #{patient.cardNumber}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex justify-center">
          <HealthCard patient={patient} />
        </div>
      )}
    </Layout>
  );
};

export default PatientCard;