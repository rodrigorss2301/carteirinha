import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCard } from './entities/health-card.entity';
import { HealthCardsService } from './health-cards.service';
import { HealthCardsController } from './health-cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCard])],
  providers: [HealthCardsService],
  controllers: [HealthCardsController],
  exports: [HealthCardsService],
})
export class HealthCardsModule {}
