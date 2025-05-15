export declare class CreateHealthCardDto {
    cardNumber: string;
    issueDate: Date;
    expirationDate: Date;
    status?: 'active' | 'inactive' | 'expired';
    patientId: string;
}
