/* eslint-disable @typescript-eslint/unbound-method */
import { CreatePropertyUseCase } from './create-property.use-case';
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

describe('CreatePropertyUseCase', () => {
  let useCase: CreatePropertyUseCase;
  let mockRepo: jest.Mocked<PropertyRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    useCase = new CreatePropertyUseCase(mockRepo);
  });

  it('should create and save a new property', async () => {
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      title: 'Nice Apartment',
      address: '123 Main St',
      price: 1500000000,
      type: PropertyType.SALE,
      area: 100,
      roomsCount: 2,
      ownerId: 'owner-123',
    });

    expect(result).toBeInstanceOf(Property);
    expect(result.title).toBe('Nice Apartment');
    expect(result.ownerId).toBe('owner-123');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw when input is invalid', async () => {
    await expect(
      useCase.execute({
        title: 'Hi',
        address: '123 Main St',
        price: 1500000000,
        type: PropertyType.SALE,
        area: 100,
        roomsCount: 2,
        ownerId: 'owner-123',
      }),
    ).rejects.toThrow();

    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
