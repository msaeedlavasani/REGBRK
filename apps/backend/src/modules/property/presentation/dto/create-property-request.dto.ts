import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { PropertyType } from '../../domain/value-objects/property-type.enum';

export class CreatePropertyRequestDto {
  @ApiProperty({ example: 'Beautiful Apartment' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @MinLength(3)
  address: string;

  @ApiProperty({ example: 2500000000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ enum: PropertyType, example: PropertyType.SALE })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @IsPositive()
  area: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  roomsCount: number;
}
