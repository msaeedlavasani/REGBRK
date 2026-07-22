import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../domain/entities/property.entity';
import { PropertyType } from '../../domain/value-objects/property-type.enum';
import { PropertyStatus } from '../../domain/value-objects/property-status.enum';

export class PropertyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: PropertyType })
  type: PropertyType;

  @ApiProperty()
  area: number;

  @ApiProperty()
  roomsCount: number;

  @ApiProperty({ enum: PropertyStatus })
  status: PropertyStatus;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  createdAt: Date;

  static fromDomain(property: Property): PropertyResponseDto {
    const dto = new PropertyResponseDto();
    dto.id = property.id.toString();
    dto.title = property.title;
    dto.address = property.address;
    dto.price = property.price.toNumber();
    dto.type = property.type;
    dto.area = property.area;
    dto.roomsCount = property.roomsCount;
    dto.status = property.status;
    dto.ownerId = property.ownerId;
    dto.createdAt = property.createdAt;
    return dto;
  }
}
