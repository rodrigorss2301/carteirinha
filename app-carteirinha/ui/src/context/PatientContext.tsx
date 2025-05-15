import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient } from '../types';
import { patientService } from '../services/api';
import { useAuth } from './AuthContext';
import { AxiosError } from 'axios';

interface PatientError {
  message: string;
  code?: string;
  field?: string;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: {
    list: boolean;
    submit: boolean;
    delete: boolean;
  };
  error: PatientError | null;
}

interface PatientContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: {
    list: boolean;
    submit: boolean;
    delete: boolean;
  };
  error: PatientError | null;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  updatePatient: (id: string, patient: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  getPatient: (id: string) => Promise<Patient | undefined>;
  searchPatients: (query: string) => Patient[];
  refreshPatients: () => Promise<void>;
  clearError: () => void;
  setSelectedPatient: (patient: Patient | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PatientState>({
    patients: [],
    selectedPatient: null,
    loading: {
      list: true,
      submit: false,
      delete: false
    },
    error: null
  });

  const { isAuthenticated } = useAuth();

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  const setLoading = (type: keyof PatientState['loading'], value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [type]: value }
    }));
  };

  const handleApiError = (error: unknown, defaultMessage: string): PatientError => {
    if (error instanceof Error) {
      const axiosError = error as AxiosError<{ message: string; code?: string; field?: string }>;
      return {
        message: axiosError.response?.data?.message || error.message,
        code: axiosError.response?.data?.code,
        field: axiosError.response?.data?.field
      };
    }
    return { message: defaultMessage };
  };

  const validatePatientData = (data: Partial<Patient>): PatientError | null => {
    if ('name' in data) {
      if (!data.name?.trim()) {
        return { message: 'Nome é obrigatório', field: 'name' };
      }
      if (data.name.trim().length < 3) {
        return { message: 'Nome deve ter pelo menos 3 caracteres', field: 'name' };
      }
    }
    
    if ('cpf' in data) {
      if (!data.cpf) {
        return { message: 'CPF é obrigatório', field: 'cpf' };
      }
      if (!data.cpf.match(/^\d{11}$/)) {
        return { message: 'CPF deve conter 11 dígitos', field: 'cpf' };
      }
    }
    
    if ('email' in data && data.email) {
      if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return { message: 'Email inválido', field: 'email' };
      }
    }
    
    if ('phoneNumber' in data) {
      if (!data.phoneNumber) {
        return { message: 'Telefone é obrigatório', field: 'phoneNumber' };
      }
      if (!data.phoneNumber.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)) {
        return { message: 'Telefone deve estar no formato (99) 99999-9999', field: 'phoneNumber' };
      }
    }
    
    return null;
  };

  const refreshPatients = async () => {
    try {
      setLoading('list', true);
      const response = await patientService.getAll();
      setState(prev => ({
        ...prev,
        patients: response.data,
        error: null
      }));
    } catch (err) {
      const apiError = handleApiError(err, 'Falha ao carregar pacientes');
      setState(prev => ({ ...prev, error: apiError }));
      console.error('Failed to load patients:', err);
    } finally {
      setLoading('list', false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshPatients();
    } else {
      setState(prev => ({ ...prev, patients: [], selectedPatient: null }));
    }
  }, [isAuthenticated]);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    const validationError = validatePatientData(patientData);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      throw new Error(validationError.message);
    }

    try {
      setLoading('submit', true);
      const response = await patientService.create(patientData);
      const newPatient = response.data;
      
      setState(prev => ({
        ...prev,
        patients: [...prev.patients, newPatient],
        error: null
      }));
      
      return newPatient;
    } catch (error) {
      const apiError = handleApiError(error, 'Falha ao adicionar paciente');
      setState(prev => ({ ...prev, error: apiError }));
      throw error;
    } finally {
      setLoading('submit', false);
    }
  };

  const updatePatient = async (
    id: string,
    patientData: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Patient> => {
    const validationError = validatePatientData(patientData);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      throw new Error(validationError.message);
    }

    try {
      setLoading('submit', true);
      const response = await patientService.update(id, patientData);
      const updatedPatient = response.data;
      
      setState(prev => ({
        ...prev,
        patients: prev.patients.map(p => p.id === id ? updatedPatient : p),
        selectedPatient: prev.selectedPatient?.id === id ? updatedPatient : prev.selectedPatient,
        error: null
      }));
      
      return updatedPatient;
    } catch (error) {
      const apiError = handleApiError(error, 'Falha ao atualizar paciente');
      setState(prev => ({ ...prev, error: apiError }));
      throw error;
    } finally {
      setLoading('submit', false);
    }
  };

  const deletePatient = async (id: string): Promise<void> => {
    const originalState = { ...state };
    try {
      setLoading('delete', true);
      // Optimistic update
      setState(prev => ({
        ...prev,
        patients: prev.patients.filter(p => p.id !== id),
        selectedPatient: prev.selectedPatient?.id === id ? null : prev.selectedPatient
      }));
      
      await patientService.delete(id);
    } catch (error) {
      // Rollback on error
      setState(originalState);
      const apiError = handleApiError(error, 'Falha ao excluir paciente');
      setState(prev => ({ ...prev, error: apiError }));
      throw error;
    } finally {
      setLoading('delete', false);
    }
  };

  const getPatient = async (id: string): Promise<Patient | undefined> => {
    try {
      // First check if we have it in state
      const cachedPatient = state.patients.find(p => p.id === id);
      if (cachedPatient) {
        setState(prev => ({ ...prev, selectedPatient: cachedPatient }));
        return cachedPatient;
      }

      // If not, fetch from API
      const response = await patientService.getById(id);
      const patient = response.data;
      setState(prev => ({ ...prev, selectedPatient: patient }));
      return patient;
    } catch (error) {
      const apiError = handleApiError(error, 'Falha ao buscar paciente');
      setState(prev => ({ ...prev, error: apiError }));
      return undefined;
    }
  };

  const searchPatients = (query: string): Patient[] => {
    const lowercaseQuery = query.toLowerCase().trim();
    if (!lowercaseQuery) return state.patients;

    return state.patients.filter(patient =>
      patient.name.toLowerCase().includes(lowercaseQuery) ||
      patient.cpf.includes(lowercaseQuery) ||
      (patient.email && patient.email.toLowerCase().includes(lowercaseQuery)) ||
      patient.phoneNumber.toLowerCase().includes(lowercaseQuery)
    );
  };

  const setSelectedPatient = (patient: Patient | null) => {
    setState(prev => ({ ...prev, selectedPatient: patient }));
  };

  return (
    <PatientContext.Provider
      value={{
        ...state,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        searchPatients,
        refreshPatients,
        clearError,
        setSelectedPatient
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};