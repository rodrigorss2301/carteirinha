import { Injectable } from '@nestjs/common';
import { Patient } from 'src/patients/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from 'src/users/entities/role.type';
import { ContractType } from 'src/patients/types/contract.type';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';
import { PatientsService } from 'src/patients/patients.service';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
  ) {}

  private handlePatientCreationError(error: any, patientName: string) {
    if (error.message.includes('CPF already exists')) {
      console.log(`Patient with same CPF already exists.`);
    } else {
      console.error(`Error creating patient (${patientName}):`, error.message);
    }
  }

  async seed() {
    console.log('=======  STARTING DATABASE SEEDING =======');

    const usersTableName = this.dataSource.getMetadata(User).tableName;
    const patientsTableName = this.dataSource.getMetadata(Patient).tableName;

    await this.dataSource.query(
      `TRUNCATE TABLE "${patientsTableName}" RESTART IDENTITY CASCADE;`,
    );
    await this.dataSource.query(
      `TRUNCATE TABLE "${usersTableName}" RESTART IDENTITY CASCADE;`,
    );

    try {
      await this.usersService.create({
        username: 'admin',
        name: 'Admin User',
        password: 'Admin123#',
        role: Role.ADMIN,
      });
      console.log('Admin user created.');
    } catch (error) {
      if (error.message.includes('Username already exists')) {
        console.log('Admin user already exists.');
      } else {
        console.error('Error creating admin user:', error.message);
      }
    }

    // Criar usuário do paciente primeiro
    const patientUserData: CreateUserDto = {
      username: 'johndoe',
      name: 'John Doe',
      password: 'Patient123#',
      role: Role.PATIENT,
    };

    try {
      const patientUser = await this.usersService.create(patientUserData);
      console.log('Patient user created.');

      const patientSeedData: CreatePatientDto = {
        firstName: 'John',
        surName: 'Doe',
        cpf: '11600194796',
        birthDate: new Date('1990-01-01'),
        medicalRecordNumber: '123456789',
        medicalRecordNumberHolder: 'John Doe',
        contractStartDate: new Date('2023-01-01'),
        contractExpirationDate: new Date('2024-01-01'),
        contractType: ContractType.FULL_DISCOUNT,
        user: { id: patientUser.id },
      };

      const createdPatient = await this.patientsService.create(patientSeedData);
      console.log(
        `Patient "${createdPatient.firstName} ${createdPatient.surName}" created and linked to user "${patientUser.username}".`,
      );
    } catch (error) {
      this.handlePatientCreationError(error, 'John Doe');
    }

    // Criar segundo usuário paciente
    const patientUserData2: CreateUserDto = {
      username: 'janesmith',
      name: 'Jane Smith',
      password: 'Patient123#',
      role: Role.PATIENT,
    };

    try {
      const patientUser2 = await this.usersService.create(patientUserData2);
      console.log('Second patient user created.');

      const patientSeedData2: CreatePatientDto = {
        firstName: 'Jane',
        surName: 'Smith',
        cpf: '98765432100',
        birthDate: new Date('1985-05-15'),
        medicalRecordNumber: '987654321',
        medicalRecordNumberHolder: 'Jane Smith',
        contractStartDate: new Date('2022-06-01'),
        contractExpirationDate: new Date('2025-06-01'),
        contractType: ContractType.DISCOUNT_CONSULTATION,
        user: { id: patientUser2.id },
      };

      const createdPatient2 =
        await this.patientsService.create(patientSeedData2);
      console.log(
        `Patient "${createdPatient2.firstName} ${createdPatient2.surName}" created and linked to user "${patientUser2.username}".`,
      );
    } catch (error) {
      this.handlePatientCreationError(error, 'Jane Smith');
    }

    console.log('======= DATABASE SEEDING COMPLETED =======');
  }
}
