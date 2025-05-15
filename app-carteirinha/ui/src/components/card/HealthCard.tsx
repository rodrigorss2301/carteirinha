import React, { useState } from 'react';
import { Patient } from '../../types';
import { Calendar, User, Users, ShieldCheck, QrCode, Share2 } from 'lucide-react';
import Button from '../ui/Button';

interface HealthCardProps {
  patient: Patient;
  isEditable?: boolean;
  onEdit?: (updatedPatient: Patient) => void;
}

const HealthCard: React.FC<HealthCardProps> = ({ patient, isEditable, onEdit }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(patient);
  
  const formattedDob = new Date(patient.dateOfBirth).toLocaleDateString('pt-BR');
  const formattedValidUntil = new Date(patient.validUntil).toLocaleDateString('pt-BR');
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedPatient);
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105">
        <div className="px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">PoliCardMed</h2>
            <ShieldCheck className="h-6 w-6" />
          </div>

          {isEditing ? (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                name="name"
                value={editedPatient.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-gray-900"
                placeholder="Nome do Paciente"
              />
              <input
                type="text"
                name="cardNumber"
                value={editedPatient.cardNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-gray-900"
                placeholder="Número da Carteirinha"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="text-lg">{patient.name}</span>
              </div>
              <div className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                <span>Carteirinha Nº: {patient.cardNumber}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Data de Nascimento: {formattedDob}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Plano: {patient.planType}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Válido até: {formattedValidUntil}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            {isEditable && (
              <>
                {isEditing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEdit}
                  >
                    Editar
                  </Button>
                )}
              </>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {showShareOptions && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Opções de Compartilhamento</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {/* Implementar compartilhamento por email */}}
            >
              Enviar por Email
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {/* Implementar compartilhamento por WhatsApp */}}
            >
              Enviar por WhatsApp
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {/* Implementar download em PDF */}}
            >
              Baixar PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCard;