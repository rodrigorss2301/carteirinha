import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { HealthCardsService } from './health-cards.service';
import { CreateHealthCardDto } from './dto/create-health-card.dto';
import { UpdateHealthCardDto } from './dto/update-health-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('health-cards')
export class HealthCardsController {
  constructor(private readonly healthCardsService: HealthCardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHealthCardDto: CreateHealthCardDto) {
    return this.healthCardsService.create(createHealthCardDto);
  }

  @Get()
  findAll() {
    return this.healthCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthCardsService.findOne(id);
  }

  @Get('patient/:patientId')
  findByPatientId(@Param('patientId') patientId: string) {
    return this.healthCardsService.findByPatientId(patientId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthCardDto: UpdateHealthCardDto) {
    return this.healthCardsService.update(id, updateHealthCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.healthCardsService.remove(id);
  }
}
