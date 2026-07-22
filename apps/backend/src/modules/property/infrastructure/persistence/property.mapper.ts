import { Property } from '../../domain/entities/property.entity';
import { PropertyId } from '../../domain/value-objects/property-id.vo';
import { Money } from '../../domain/value-objects/money.vo';
import { PropertyOrmEntity } from './property.orm-entity';

export class PropertyMapper {
  static toDomain(orm: PropertyOrmEntity): Property {
    return Property.reconstitute({
      id: PropertyId.fromString(orm.id),
      title: orm.title,
      address: orm.address,
      price: Money.create(Number(orm.price)),
      type: orm.type,
      area: orm.area,
      roomsCount: orm.roomsCount,
      status: orm.status,
      ownerId: orm.ownerId,
      createdAt: orm.createdAt,
    });
  }

  static toOrm(property: Property): PropertyOrmEntity {
    const orm = new PropertyOrmEntity();
    orm.id = property.id.toString();
    orm.title = property.title;
    orm.address = property.address;
    orm.price = property.price.toNumber().toString();
    orm.type = property.type;
    orm.area = property.area;
    orm.roomsCount = property.roomsCount;
    orm.status = property.status;
    orm.ownerId = property.ownerId;
    orm.createdAt = property.createdAt;
    return orm;
  }
}
