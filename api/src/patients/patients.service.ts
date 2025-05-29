import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { user: userData, ...patientData } = createPatientDto;

    try {
      // 1. Verificar se já existe um paciente com o mesmo CPF
      const existingPatient = await this.patientRepository.findOne({
        where: { cpf: patientData.cpf },
      });

      if (existingPatient) {
        throw new ConflictException('CPF already exists');
      }

      // 2. Buscar o usuário pelo ID
      const user = await this.usersService.findOne(userData.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 3. Verificar se o usuário já tem um paciente associado
      if (user.patient) {
        throw new ConflictException('User already has a patient record');
      }

      // 4. Criar e salvar o paciente
      const patient = this.patientRepository.create({
        ...patientData,
        user,
      });

      const savedPatient = await this.patientRepository.save(patient);

      // 5. Retornar o paciente com todas as relações carregadas
      return await this.findOne(savedPatient.id);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Failed to create patient record');
    }
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findByCpf(cpf: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { cpf },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    // Verificar se o paciente existe
    const patient = await this.findOne(id);

    try {
      // Verificar se está tentando atualizar o CPF e se já existe
      if (updatePatientDto.cpf && updatePatientDto.cpf !== patient.cpf) {
        const existingPatient = await this.patientRepository.findOne({
          where: { cpf: updatePatientDto.cpf },
        });

        if (existingPatient) {
          throw new ConflictException('CPF already exists');
        }
      }

      // Atualizar o paciente
      this.patientRepository.merge(patient, updatePatientDto);
      const updatedPatient = await this.patientRepository.save(patient);

      return updatedPatient;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Failed to update patient record');
    }
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }
}
