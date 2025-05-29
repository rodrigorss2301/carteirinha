import { IsString, IsNotEmpty, MinLength, IsEnum, IsStrongPassword } from 'class-validator';
import { Role } from 'src/users/entities/role.type';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsEnum(Role)
  role: Role = Role.PATIENT; // Default role is PATIENT
}
