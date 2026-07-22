import { PropertyType } from '../../domain/value-objects/property-type.enum';

export interface CreatePropertyDto {
  title: string;
  address: string;
  price: number;
  type: PropertyType;
  area: number;
  roomsCount: number;
  ownerId: string;
}
