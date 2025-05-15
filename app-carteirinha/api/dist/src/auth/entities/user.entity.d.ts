export declare class User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: 'admin' | 'paciente';
    patientId?: string;
    createdAt: Date;
    updatedAt: Date;
}
