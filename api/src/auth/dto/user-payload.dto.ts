import { Patient } from "src/patients/entities/patient.entity";
import { Role } from "src/users/entities/role.type";

export class UserPayloadDto {
    username: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    patient?: Patient | null;
}