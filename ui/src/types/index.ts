export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: Date;
  mothersName: string;
  fathersName?: string;
  address: string;
  phoneNumber: string;
  email?: string;
  healthCards?: HealthCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthCard {
  id: string;
  cardNumber: string;
  issueDate: Date;
  expirationDate: Date;
  status: 'active' | 'inactive' | 'expired';
  patient: Patient;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'paciente';
  patientId?: string; // ID do paciente associado, se for um usuário paciente
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}