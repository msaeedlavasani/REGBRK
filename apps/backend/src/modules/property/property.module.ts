import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyOrmEntity } from './infrastructure/persistence/property.orm-entity';
import { TypeOrmPropertyRepository } from './infrastructure/persistence/typeorm-property.repository';
import { PROPERTY_REPOSITORY } from './domain/repositories/property.repository';
import { CreatePropertyUseCase } from './application/commands/create-property.use-case';
import { PropertyController } from './presentation/controllers/property.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyOrmEntity])],
  controllers: [PropertyController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY,
      useClass: TypeOrmPropertyRepository,
    },
    CreatePropertyUseCase,
  ],
  exports: [PROPERTY_REPOSITORY, CreatePropertyUseCase],
})
export class PropertyModule {}
