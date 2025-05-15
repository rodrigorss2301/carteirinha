import React, { useMemo } from 'react';
import { Patient } from '../../types';
import Card from '../ui/Card';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const formattedDob = useMemo(() => {
    const date = new Date(patient.dateOfBirth);
    return date.toLocaleDateString();
  }, [patient.dateOfBirth]);

  const formattedValidUntil = useMemo(() => {
    const date = new Date(patient.validUntil);
    return date.toLocaleDateString();
  }, [patient.validUntil]);

  return (
    <Card className="h-full">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="flex-shrink-0 mb-4 sm:mb-0">
          {patient.photo ? (
            <img
              src={patient.photo}
              alt={patient.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-12 w-12 text-blue-500" />
            </div>
          )}
        </div>
        <div className="flex-1 sm:ml-6 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Carteirinha:</span> {patient.cardNumber}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Plano:</span> {patient.planType}
          </p>
          <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600 mb-1">
            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
            <span>Data de Nasc.: {formattedDob}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
            <span>Válido até: {formattedValidUntil}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-blue-500" />
            <span>{patient.contactNumber}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span>{patient.address}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/patients/${patient.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver Detalhes →
        </Link>
      </div>
    </Card>
  );
};

export default PatientCard;