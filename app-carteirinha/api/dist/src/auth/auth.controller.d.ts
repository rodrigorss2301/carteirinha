import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
