import { GetPropertyByIdUseCase } from './get-property-by-id.use-case';
import { PropertyRepository } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';
import { PropertyType } from '../../domain/value-objects/property-type.enum';
import { PropertyNotFoundError } from '../errors/property-not-found.error';

function createMockRepository(): jest.Mocked<PropertyRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByOwnerId: jest.fn(),
  };
}

describe('GetPropertyByIdUseCase', () => {
  it('should return the property when found', async () => {
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
    mockRepo.findById.mockResolvedValue(property);

    const useCase = new GetPropertyByIdUseCase(mockRepo);
    const result = await useCase.execute(property.id.toString());

    expect(result).toBe(property);
  });

  it('should throw PropertyNotFoundError when property does not exist', async () => {
    const mockRepo = createMockRepository();
    mockRepo.findById.mockResolvedValue(null);

    const useCase = new GetPropertyByIdUseCase(mockRepo);
    const randomId = '11111111-1111-1111-1111-111111111111';

    await expect(useCase.execute(randomId)).rejects.toThrow(
      PropertyNotFoundError,
    );
  });
});
