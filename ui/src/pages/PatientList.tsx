import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { usePatients } from '../context/PatientContext';
import PatientCard from '../components/patient/PatientCard';
import PatientSearch from '../components/patient/PatientSearch';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Plus, UserPlus, Users } from 'lucide-react';
import { Patient } from '../types';

const PatientList: React.FC = () => {
  const { patients } = usePatients();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2 text-blue-600" />
            Patients
          </h1>
          <p className="text-gray-600">Manage your registered patients and their health cards.</p>
        </div>
        <Link to="/patients/new" className="mt-4 sm:mt-0">
          <Button variant="primary" icon={<UserPlus className="h-5 w-5" />}>
            New Patient
          </Button>
        </Link>
      </div>

      <PatientSearch onResultsChange={setFilteredPatients} />

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-6">
            {patients.length === 0
              ? "You haven't registered any patients yet."
              : "No patients match your search criteria."}
          </p>
          {patients.length === 0 && (
            <Link to="/patients/new">
              <Button variant="primary" icon={<Plus className="h-5 w-5" />}>
                Register Your First Patient
              </Button>
            </Link>
          )}
        </div>
      )}
    </Layout>
  );
};

export default PatientList;