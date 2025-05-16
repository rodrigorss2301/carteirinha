import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { HealthCard } from '../../health-cards/entities/health-card.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  birthDate: Date;

  @Column()
  mothersName: string;

  @Column({ nullable: true })
  fathersName: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => HealthCard, healthCard => healthCard.patient)
  healthCards: HealthCard[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
