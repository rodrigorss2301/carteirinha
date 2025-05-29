import { forwardRef, Module } from '@nestjs/common';
import { PasswordHelper } from './helpers/password.helper';
import { SeedService } from './services/seed.service';
import { UsersModule } from 'src/users/users.module';
import { PatientsModule } from 'src/patients/patients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient])],
  controllers: [],
  providers: [PasswordHelper, SeedService],
  exports: [PasswordHelper, SeedService],
})
export class SharedModule {}
