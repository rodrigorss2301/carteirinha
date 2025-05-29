import { Patient } from "src/patients/entities/patient.entity";
import { Role } from "src/users/entities/role.type";
import { User } from "../entities/user.entity";

export class UserResponseDto  {
    id: string;
    username: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    patient: Patient | null;

    public static fromEntity(user: User): UserResponseDto {
        const userResponse = new UserResponseDto();
        userResponse.id = user.id;
        userResponse.username = user.username;
        userResponse.name = user.name;
        userResponse.role = user.role;
        userResponse.createdAt = user.createdAt;
        userResponse.updatedAt = user.updatedAt;
        userResponse.patient = user.patient || null; // Ensure patient is null if not set
        return userResponse;

        // const { password: password, ...result} = user;
        // return result;
    }
}