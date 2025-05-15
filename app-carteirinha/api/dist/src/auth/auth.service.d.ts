import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: User): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            name: string;
            role: "admin" | "paciente";
            patientId: string | undefined;
        };
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        id: string;
        username: string;
        name: string;
        role: "admin" | "paciente";
        patientId?: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
