import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { PasswordHelper } from '../helpers/password.helper';
import { Role } from 'src/users/entities/role.type';
import { ContractType } from 'src/patients/types/contract.type';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async seed() {
    await this.ensureDatabaseCreated();
    console.log('=======  SEEDING DATABASE =======');

    const usersTableName = this.dataSource.getMetadata(User).tableName;
    const patientsTableName = this.dataSource.getMetadata(Patient).tableName;

    // Usar TRUNCATE com CASCADE para limpar as tabelas e reiniciar identidades
    // A ordem aqui importa menos se CASCADE for usado corretamente.
    // Truncar Patient primeiro (ou User se Patient depende dele e não há CASCADE no User truncate)
    await this.dataSource.query(`TRUNCATE TABLE "${patientsTableName}" RESTART IDENTITY CASCADE;`);
    await this.dataSource.query(`TRUNCATE TABLE "${usersTableName}" RESTART IDENTITY CASCADE;`);

    // Criar usuários usando UserRepository
    const adminPassword = await this.passwordHelper.hash('Admin123#');
    const adminUserEntity = this.userRepository.create({
      username: 'admin',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    });
    await this.userRepository.save(adminUserEntity);

    const patientPassword = await this.passwordHelper.hash('Patient123#');
    const patientUserEntity = this.userRepository.create({
      username: 'patient',
      name: 'Patient User',
      password: patientPassword,
      role: Role.PATIENT,
    });
    const savedPatientUser = await this.userRepository.save(patientUserEntity);

    if (!savedPatientUser) {
      // Se o método create do serviço retornar null ou undefined em caso de falha,
      // ou se quisermos ser extra cautelosos.
      // Geralmente, se create falhar, ele deve lançar uma exceção.
      console.error('Patient user could not be created via repository.');
      // Consider throwing an error if subsequent operations depend on this user
      // throw new Error('Patient user could not be created.');
    }

    const patientData: CreatePatientDto = {
      firstName: 'John',
      surName: 'Doe',
      cpf: '116.001.947-96',
      birthDate: new Date('1990-01-01'),
      medicalRecordNumber: '123456789',
      contractStartDate: new Date('2023-01-01'),
      contractExpirationDate: new Date('2024-01-01'),
      contractType: ContractType.FULL_DISCOUNT, 
      medicalRecordNumberHolder: 'John Doe',
    };

    // Criar paciente usando PatientRepository
    const patientEntity = this.patientRepository.create(patientData);
    // Se o paciente precisar ser associado ao 'savedPatientUser', você faria a associação aqui.
    // Ex: patientEntity.user = savedPatientUser; (dependendo da estrutura da entidade Patient)
    await this.patientRepository.save(patientEntity);

    console.log('======= DATABASE SEEDED! =======');
  }

  private async ensureDatabaseCreated() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }
}
