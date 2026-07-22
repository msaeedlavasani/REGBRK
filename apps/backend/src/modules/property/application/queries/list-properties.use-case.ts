import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/entities/property.entity';
import type { PropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(): Promise<Property[]> {
    return this.propertyRepository.findAll();
  }
}
