import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ContractType } from '../types/contract.type';
import { User } from '../../users/entities/user.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  surName: string;

  @Column({ unique: true, nullable: false })
  cpf: string;

  @Column({ type: 'date', nullable: false })
  birthDate: Date;

  @Column({ nullable: false })
  medicalRecordNumber: string;

  @Column({ nullable: true })
  medicalRecordNumberHolder?: string;

  @Column({ type: 'date', nullable: false })
  contractStartDate: Date;

  @Column({ type: 'date', nullable: false })
  contractExpirationDate: Date;

  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: false,
  })
  contractType: ContractType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.patient, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
