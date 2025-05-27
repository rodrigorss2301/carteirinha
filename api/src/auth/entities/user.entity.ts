import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Will be hashed

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'paciente', 'subscriber', 'affiliate'],
    default: 'paciente'
  })
  role: 'admin' | 'paciente' | 'subscriber' | 'affiliate';

  @Column({ nullable: true })
  patientId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
