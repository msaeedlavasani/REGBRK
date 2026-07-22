import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserOrmEntity } from './src/modules/identity-access/infrastructure/persistence/user.orm-entity';
import { PropertyOrmEntity } from './src/modules/property/infrastructure/persistence/property.orm-entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserOrmEntity, PropertyOrmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
