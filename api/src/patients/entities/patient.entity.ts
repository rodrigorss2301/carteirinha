import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ContractType } from '../types/contract.type';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  surName: string;

  @Column({ unique: true, nullable: false })
  cpf: string;

  @Column({ nullable: false })
  birthDate: Date;

  @Column({ unique: true, nullable: false })
  medicalRecordNumber: string;

  @Column({ nullable: true })
  medicalRecordNumberHolder?: string;

  @Column({ nullable: false })
  contractStartDate: Date;

  @Column({ nullable: false })
  contractExpirationDate: Date;

  @Column({ nullable: false })
  contractType: ContractType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.patient)
  user: User;
}
