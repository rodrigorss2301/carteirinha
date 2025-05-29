// /home/arthur-ss/repos/carteirinha/api/src/patients/dto/create-patient.dto.ts
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCpf } from 'src/shared/helpers/cpf.helper';
import { ContractType } from '../types/contract.type';
import { PatientUserDto } from './patient-user.dto';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  // Patient fields
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  surName: string;

  @IsNotEmpty()
  @IsString()
  @IsCpf() // Custom decorator to validate CPF format
  cpf: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsNotEmpty()
  @IsString()
  medicalRecordNumber: string;

  @IsOptional()
  @IsString()
  medicalRecordNumberHolder?: string;

  @IsNotEmpty()
  @IsDateString()
  contractStartDate: Date;

  @IsNotEmpty()
  @IsDateString()
  contractExpirationDate: Date;

  @IsNotEmpty()
  @IsEnum(ContractType) // Assuming ContractType is an enum
  contractType: ContractType;

  // User fields nested as an object
  @IsNotEmpty()
  @Type(() => PatientUserDto)
  user: PatientUserDto;
}
