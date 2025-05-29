import { IsString, IsNotEmpty } from 'class-validator';

export class PatientUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
