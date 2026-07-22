import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRepository } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';
import { PropertyId } from '../../domain/value-objects/property-id.vo';
import { PropertyOrmEntity } from './property.orm-entity';
import { PropertyMapper } from './property.mapper';

@Injectable()
export class TypeOrmPropertyRepository implements PropertyRepository {
  constructor(
    @InjectRepository(PropertyOrmEntity)
    private readonly repo: Repository<PropertyOrmEntity>,
  ) {}

  async save(property: Property): Promise<void> {
    const orm = PropertyMapper.toOrm(property);
    await this.repo.save(orm);
  }

  async findById(id: PropertyId): Promise<Property | null> {
    const orm = await this.repo.findOne({ where: { id: id.toString() } });
    return orm ? PropertyMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Property[]> {
    const orms = await this.repo.find();
    return orms.map((orm) => PropertyMapper.toDomain(orm));
  }

  async findByOwnerId(ownerId: string): Promise<Property[]> {
    const orms = await this.repo.find({ where: { ownerId } });
    return orms.map((orm) => PropertyMapper.toDomain(orm));
  }
}
