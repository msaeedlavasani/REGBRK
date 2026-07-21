import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const orm = UserMapper.toOrm(user);
    await this.repo.save(orm);
  }

  async findById(id: UserId): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id: id.toString() } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const orm = await this.repo.findOne({
      where: { email: email.toString() },
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<User[]> {
    const orms = await this.repo.find();
    return orms.map((orm) => UserMapper.toDomain(orm));
  }
}
