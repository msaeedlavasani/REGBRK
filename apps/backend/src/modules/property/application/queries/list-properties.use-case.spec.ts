import { ListPropertiesUseCase } from './list-properties.use-case';
import { PropertyRepository } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';
import { PropertyType } from '../../domain/value-objects/property-type.enum';

function createMockRepository(): jest.Mocked<PropertyRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByOwnerId: jest.fn(),
  };
}

describe('ListPropertiesUseCase', () => {
  it('should return all properties', async () => {
    const mockRepo = createMockRepository();
    const property = Property.create({
      title: 'Sample Property',
      address: '123 Main St',
      price: 1000000000,
      type: PropertyType.SALE,
      area: 80,
      roomsCount: 2,
      ownerId: 'owner-1',
    });
    mockRepo.findAll.mockResolvedValue([property]);

    const useCase = new ListPropertiesUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(property);
  });

  it('should return an empty array when there are no properties', async () => {
    const mockRepo = createMockRepository();
    mockRepo.findAll.mockResolvedValue([]);

    const useCase = new ListPropertiesUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
