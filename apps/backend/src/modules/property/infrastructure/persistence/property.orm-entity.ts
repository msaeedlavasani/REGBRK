import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { PropertyType } from '../../domain/value-objects/property-type.enum';
import { PropertyStatus } from '../../domain/value-objects/property-status.enum';

@Entity({ name: 'properties' })
export class PropertyOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'bigint' })
  price: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  type: PropertyType;

  @Column({ type: 'float' })
  area: number;

  @Column({ type: 'int', name: 'rooms_count' })
  roomsCount: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.ACTIVE,
  })
  status: PropertyStatus;

  @Column({ type: 'varchar', name: 'owner_id' })
  ownerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
