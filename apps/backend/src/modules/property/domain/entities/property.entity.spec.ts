import { Property } from './property.entity';
import { PropertyType } from '../value-objects/property-type.enum';
import { PropertyStatus } from '../value-objects/property-status.enum';

describe('Property Entity', () => {
  const validParams = {
    title: 'Beautiful Apartment',
    address: '123 Main Street',
    price: 2500000000,
    type: PropertyType.SALE,
    area: 120,
    roomsCount: 3,
    ownerId: 'owner-123',
  };

  it('should create a valid property', () => {
    const property = Property.create(validParams);

    expect(property.title).toBe('Beautiful Apartment');
    expect(property.address).toBe('123 Main Street');
    expect(property.price.toNumber()).toBe(2500000000);
    expect(property.type).toBe(PropertyType.SALE);
    expect(property.area).toBe(120);
    expect(property.roomsCount).toBe(3);
    expect(property.status).toBe(PropertyStatus.ACTIVE);
    expect(property.ownerId).toBe('owner-123');
    expect(property.id).toBeDefined();
    expect(property.createdAt).toBeInstanceOf(Date);
  });

  it('should throw when title is too short', () => {
    expect(() => Property.create({ ...validParams, title: 'Hi' })).toThrow();
  });

  it('should throw when address is too short', () => {
    expect(() => Property.create({ ...validParams, address: 'X' })).toThrow();
  });

  it('should throw when area is zero or negative', () => {
    expect(() => Property.create({ ...validParams, area: 0 })).toThrow();
  });

  it('should throw when roomsCount is negative', () => {
    expect(() => Property.create({ ...validParams, roomsCount: -1 })).toThrow();
  });

  it('should throw when price is invalid', () => {
    expect(() => Property.create({ ...validParams, price: -1 })).toThrow();
  });

  it('should throw when ownerId is missing', () => {
    expect(() => Property.create({ ...validParams, ownerId: '' })).toThrow();
  });
});
