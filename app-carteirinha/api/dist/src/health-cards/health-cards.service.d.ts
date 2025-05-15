import { Repository } from 'typeorm';
import { HealthCard } from './entities/health-card.entity';
import { CreateHealthCardDto } from './dto/create-health-card.dto';
import { UpdateHealthCardDto } from './dto/update-health-card.dto';
export declare class HealthCardsService {
    private healthCardRepository;
    constructor(healthCardRepository: Repository<HealthCard>);
    create(createHealthCardDto: CreateHealthCardDto): Promise<HealthCard>;
    findAll(): Promise<HealthCard[]>;
    findOne(id: string): Promise<HealthCard>;
    findByPatientId(patientId: string): Promise<HealthCard[]>;
    update(id: string, updateHealthCardDto: UpdateHealthCardDto): Promise<HealthCard>;
    remove(id: string): Promise<void>;
}
