import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from './user.orm-entity';
import { TypeOrmUserRepository } from './typeorm-user.repository';
import { User } from '../../domain/entities/user.entity';

describe('TypeOrmUserRepository (integration)', () => {
  let repository: TypeOrmUserRepository;
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
            entities: [UserOrmEntity],
            synchronize: false,
          }),
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repository = module.get<TypeOrmUserRepository>(TypeOrmUserRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should save and retrieve a user by id', async () => {
    const user = User.create({
      email: `test-${Date.now()}@example.com`,
      fullName: 'Integration Test User',
    });

    await repository.save(user);

    const found = await repository.findById(user.id);

    expect(found).not.toBeNull();
    expect(found?.email.toString()).toBe(user.email.toString());
    expect(found?.fullName).toBe(user.fullName);
  });

  it('should find a user by email', async () => {
    const user = User.create({
      email: `test-email-${Date.now()}@example.com`,
      fullName: 'Email Lookup User',
    });

    await repository.save(user);

    const found = await repository.findByEmail(user.email);

    expect(found).not.toBeNull();
    expect(found?.id.toString()).toBe(user.id.toString());
  });
});
