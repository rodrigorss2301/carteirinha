import { Patient } from '../../patients/entities/patient.entity';
export declare class HealthCard {
    id: string;
    cardNumber: string;
    issueDate: Date;
    expirationDate: Date;
    status: 'active' | 'inactive' | 'expired';
    patient: Patient;
    createdAt: Date;
    updatedAt: Date;
}
