import { DataSource } from 'typeorm';
import { Patient } from './patients/entities/patient.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'policardmed',
  entities: [Patient],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
});

export default AppDataSource;
