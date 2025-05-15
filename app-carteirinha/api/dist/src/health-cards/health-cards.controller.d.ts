import { HealthCardsService } from './health-cards.service';
import { CreateHealthCardDto } from './dto/create-health-card.dto';
import { UpdateHealthCardDto } from './dto/update-health-card.dto';
export declare class HealthCardsController {
    private readonly healthCardsService;
    constructor(healthCardsService: HealthCardsService);
    create(createHealthCardDto: CreateHealthCardDto): Promise<import("./entities/health-card.entity").HealthCard>;
    findAll(): Promise<import("./entities/health-card.entity").HealthCard[]>;
    findOne(id: string): Promise<import("./entities/health-card.entity").HealthCard>;
    findByPatientId(patientId: string): Promise<import("./entities/health-card.entity").HealthCard[]>;
    update(id: string, updateHealthCardDto: UpdateHealthCardDto): Promise<import("./entities/health-card.entity").HealthCard>;
    remove(id: string): Promise<void>;
}
