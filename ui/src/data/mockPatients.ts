import { Patient } from '../types';

// Mock patient data for demonstration purposes
export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Silva',
    dateOfBirth: '1985-05-15',
    gender: 'female',
    cardNumber: 'HC1234567',
    planType: 'Premium Health',
    validUntil: '2025-12-31',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    contactNumber: '(11) 98765-4321',
    email: 'maria.silva@email.com',
    address: 'Av. Paulista, 1000, São Paulo, SP'
  },
  {
    id: '2',
    name: 'João Santos',
    dateOfBirth: '1978-11-23',
    gender: 'male',
    cardNumber: 'HC7654321',
    planType: 'Family Care',
    validUntil: '2025-12-31',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    contactNumber: '(11) 91234-5678',
    email: 'joao.santos@email.com',
    address: 'Rua Augusta, 500, São Paulo, SP'
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    dateOfBirth: '1990-03-10',
    gender: 'female',
    cardNumber: 'HC9876543',
    planType: 'Essential Care',
    validUntil: '2025-06-30',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    contactNumber: '(11) 97890-1234',
    email: 'ana.oliveira@email.com',
    address: 'Rua Oscar Freire, 300, São Paulo, SP'
  },
  {
    id: '4',
    name: 'Carlos Ferreira',
    dateOfBirth: '1965-08-20',
    gender: 'male',
    cardNumber: 'HC5432198',
    planType: 'Senior Health',
    validUntil: '2025-12-31',
    photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
    contactNumber: '(11) 96543-2109',
    email: 'carlos.ferreira@email.com',
    address: 'Alameda Santos, 800, São Paulo, SP'
  },
  {
    id: '5',
    name: 'Fernanda Costa',
    dateOfBirth: '1992-01-05',
    gender: 'female',
    cardNumber: 'HC2345678',
    planType: 'Premium Health',
    validUntil: '2025-12-31',
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200',
    contactNumber: '(11) 95678-9012',
    email: 'fernanda.costa@email.com',
    address: 'Rua Bela Cintra, 200, São Paulo, SP'
  }
];