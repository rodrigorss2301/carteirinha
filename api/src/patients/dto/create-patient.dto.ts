import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { ContractType } from '../types/contract.type';
import { IsCpf } from 'src/shared/helpers/cpf.helper';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  surName: string;

  @IsCpf()
  @IsNotEmpty()
  cpf: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsNumberString()
  @IsNotEmpty()
  medicalRecordNumber: string;

  @IsNumberString()
  @IsOptional()
  medicalRecordNumberHolder?: string;

  @IsDateString()
  @IsNotEmpty()
  contractStartDate: Date;

  @IsDateString()
  @IsNotEmpty()
  contractExpirationDate: Date;

  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType;
}
