import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateHealthCardDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsDateString()
  issueDate: Date;

  @IsDateString()
  expirationDate: Date;

  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive' | 'expired';

  @IsString()
  @IsNotEmpty()
  patientId: string;
}
