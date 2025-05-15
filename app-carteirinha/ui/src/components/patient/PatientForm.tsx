import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { User, Calendar, UserCircle, CreditCard, Phone, Mail, Home } from 'lucide-react';

interface PatientFormProps {
  onSuccess?: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
  const { addPatient } = usePatients();
  
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'masculino',
    planType: 'Plano Essencial',
    validUntil: '',
    photo: '',
    contactNumber: '',
    email: '',
    address: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa o erro deste campo quando o usuário o edita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Data de nascimento inválida';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Telefone é obrigatório';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addPatient({
        ...formData,
        id: Date.now().toString(),
        cardNumber: `PCM${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Limpar formulário
      setFormData({
        name: '',
        dateOfBirth: '',
        gender: 'masculino',
        planType: 'Plano Essencial',
        validUntil: '',
        photo: '',
        contactNumber: '',
        email: '',
        address: ''
      });
      
    } catch (error) {
      setErrors({
        submit: 'Erro ao adicionar paciente. Por favor, tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Paciente</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <Input
            label="Data de Nascimento"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            icon={<Calendar className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gênero
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Plano
            </label>
            <select
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Plano Essencial">Plano Essencial</option>
              <option value="Plano Premium">Plano Premium</option>
              <option value="Plano Empresarial">Plano Empresarial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de Contato</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Telefone"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            placeholder="(11) 99999-9999"
            required
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            required
          />
          
          <Input
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            icon={<Home className="h-5 w-5 text-gray-400" />}
            required
            className="md:col-span-2"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {errors.submit}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setFormData({
              name: '',
              dateOfBirth: '',
              gender: 'masculino',
              planType: 'Plano Essencial',
              validUntil: '',
              photo: '',
              contactNumber: '',
              email: '',
              address: ''
            });
            setErrors({});
          }}
        >
          Limpar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Cadastrar Paciente
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;