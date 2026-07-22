import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/entities/property.entity';
import { PropertyId } from '../../domain/value-objects/property-id.vo';
import type { PropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { PropertyNotFoundError } from '../errors/property-not-found.error';

@Injectable()
export class GetPropertyByIdUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(id: string): Promise<Property> {
    const propertyId = PropertyId.fromString(id);
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    return property;
  }
}
