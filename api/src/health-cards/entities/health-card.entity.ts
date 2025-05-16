import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity()
export class HealthCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cardNumber: string;

  @Column()
  issueDate: Date;

  @Column()
  expirationDate: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  })
  status: 'active' | 'inactive' | 'expired';

  @ManyToOne(() => Patient, patient => patient.healthCards, { eager: true })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
