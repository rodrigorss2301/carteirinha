import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';
import { usePatients } from '../../context/PatientContext';
import { Patient } from '../../types';

interface PatientSearchProps {
  onResultsChange: (patients: Patient[]) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onResultsChange }) => {
  const { searchPatients, patients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      onResultsChange(patients);
    } else {
      const results = searchPatients(query);
      onResultsChange(results);
    }
  };

  return (
    <div className="mb-6">
      <Input
        placeholder="Search patients by name, card number, or plan..."
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        icon={<Search className="h-5 w-5" />}
      />
    </div>
  );
};

export default PatientSearch;