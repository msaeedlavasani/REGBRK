import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/entities/property.entity';
import type { PropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { CreatePropertyDto } from '../dto/create-property.dto';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(dto: CreatePropertyDto): Promise<Property> {
    const property = Property.create({
      title: dto.title,
      address: dto.address,
      price: dto.price,
      type: dto.type,
      area: dto.area,
      roomsCount: dto.roomsCount,
      ownerId: dto.ownerId,
    });

    await this.propertyRepository.save(property);

    return property;
  }
}
