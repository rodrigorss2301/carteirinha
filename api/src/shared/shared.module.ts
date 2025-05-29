import { forwardRef, Module } from '@nestjs/common';
import { PasswordHelper } from './helpers/password.helper';
import { SeedService } from './services/seed.service';
import { UsersModule } from 'src/users/users.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [forwardRef(() => PatientsModule), forwardRef(() => UsersModule)],
  providers: [PasswordHelper, SeedService],
  exports: [PasswordHelper, SeedService],
})
export class SharedModule {}
