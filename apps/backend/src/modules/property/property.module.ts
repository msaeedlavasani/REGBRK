import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyOrmEntity } from './infrastructure/persistence/property.orm-entity';
import { TypeOrmPropertyRepository } from './infrastructure/persistence/typeorm-property.repository';
import { PROPERTY_REPOSITORY } from './domain/repositories/property.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyOrmEntity])],
  controllers: [],
  providers: [
    {
      provide: PROPERTY_REPOSITORY,
      useClass: TypeOrmPropertyRepository,
    },
  ],
  exports: [PROPERTY_REPOSITORY],
})
export class PropertyModule {}
