import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ name: 'userid' })
  userid!: number;

  @Column({ name: 'username', type: 'varchar', length: 50 })
  username!: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password!: string;

  @Column({ name: 'phonenumber', type: 'varchar', length: 20, nullable: true })
  phonenumber?: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address?: string;

  @Column({ name: 'dateofbirth', type: 'date', nullable: true })
  dateofbirth?: string;

  @Column({
    name: 'registrationdate',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registrationdate!: Date;

  @Column({ name: 'role', type: 'varchar', length: 20, default: 'Citizen' })
  role!: string;

  @Column({ name: 'regionid', type: 'int', nullable: true })
  regionid?: number;
}
