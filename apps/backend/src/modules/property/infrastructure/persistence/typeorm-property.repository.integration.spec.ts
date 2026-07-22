import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PropertyOrmEntity } from './property.orm-entity';
import { TypeOrmPropertyRepository } from './typeorm-property.repository';
import { Property } from '../../domain/entities/property.entity';
import { PropertyType } from '../../domain/value-objects/property-type.enum';

describe('TypeOrmPropertyRepository (integration)', () => {
  let repository: TypeOrmPropertyRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_NAME'),
            entities: [PropertyOrmEntity],
            synchronize: false,
          }),
        }),
        TypeOrmModule.forFeature([PropertyOrmEntity]),
      ],
      providers: [TypeOrmPropertyRepository],
    }).compile();

    repository = module.get<TypeOrmPropertyRepository>(
      TypeOrmPropertyRepository,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should save and retrieve a property by id', async () => {
    const property = Property.create({
      title: 'Integration Test Property',
      address: '456 Test Ave',
      price: 1000000000,
      type: PropertyType.SALE,
      area: 90,
      roomsCount: 2,
      ownerId: `owner-${Date.now()}`,
    });

    await repository.save(property);

    const found = await repository.findById(property.id);

    expect(found).not.toBeNull();
    expect(found?.title).toBe(property.title);
    expect(found?.price.toNumber()).toBe(property.price.toNumber());
  });

  it('should find properties by ownerId', async () => {
    const ownerId = `owner-${Date.now()}-unique`;
    const property = Property.create({
      title: 'Owner Lookup Property',
      address: '789 Owner St',
      price: 500000000,
      type: PropertyType.RENT,
      area: 60,
      roomsCount: 1,
      ownerId,
    });

    await repository.save(property);

    const found = await repository.findByOwnerId(ownerId);

    expect(found.length).toBeGreaterThan(0);
    expect(found[0].ownerId).toBe(ownerId);
  });
});
