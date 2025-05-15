import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCard } from './entities/health-card.entity';
import { CreateHealthCardDto } from './dto/create-health-card.dto';
import { UpdateHealthCardDto } from './dto/update-health-card.dto';

@Injectable()
export class HealthCardsService {
  constructor(
    @InjectRepository(HealthCard)
    private healthCardRepository: Repository<HealthCard>,
  ) {}

  async create(createHealthCardDto: CreateHealthCardDto): Promise<HealthCard> {
    const healthCard = this.healthCardRepository.create(createHealthCardDto);
    return await this.healthCardRepository.save(healthCard);
  }

  async findAll(): Promise<HealthCard[]> {
    return await this.healthCardRepository.find();
  }

  async findOne(id: string): Promise<HealthCard> {
    const healthCard = await this.healthCardRepository.findOne({ where: { id } });
    if (!healthCard) {
      throw new NotFoundException(`Health card with ID ${id} not found`);
    }
    return healthCard;
  }

  async findByPatientId(patientId: string): Promise<HealthCard[]> {
    return await this.healthCardRepository.find({
      where: { patient: { id: patientId } },
    });
  }

  async update(id: string, updateHealthCardDto: UpdateHealthCardDto): Promise<HealthCard> {
    const healthCard = await this.findOne(id);
    Object.assign(healthCard, updateHealthCardDto);
    return await this.healthCardRepository.save(healthCard);
  }

  async remove(id: string): Promise<void> {
    const result = await this.healthCardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Health card with ID ${id} not found`);
    }
  }
}
