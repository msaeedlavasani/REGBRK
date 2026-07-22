import { Property } from '../entities/property.entity';
import { PropertyId } from '../value-objects/property-id.vo';

export interface PropertyRepository {
  save(property: Property): Promise<void>;
  findById(id: PropertyId): Promise<Property | null>;
  findAll(): Promise<Property[]>;
  findByOwnerId(ownerId: string): Promise<Property[]>;
}

export const PROPERTY_REPOSITORY = Symbol('PROPERTY_REPOSITORY');
