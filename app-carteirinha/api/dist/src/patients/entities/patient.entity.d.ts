import { HealthCard } from '../../health-cards/entities/health-card.entity';
export declare class Patient {
    id: string;
    name: string;
    cpf: string;
    birthDate: Date;
    mothersName: string;
    fathersName: string;
    address: string;
    phoneNumber: string;
    email: string;
    healthCards: HealthCard[];
    createdAt: Date;
    updatedAt: Date;
}
