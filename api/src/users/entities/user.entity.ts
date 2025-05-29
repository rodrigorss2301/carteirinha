import { IsEnum } from 'class-validator';
import { Patient } from 'src/patients/entities/patient.entity';
import { Role } from 'src/users/entities/role.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  IsNull,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: Role.PATIENT })
  @IsEnum(Role)
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, { nullable: true })
  @JoinColumn()
  patient?: Patient | null;
}
