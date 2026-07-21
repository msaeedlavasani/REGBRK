import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute({
      id: UserId.fromString(orm.id),
      email: Email.create(orm.email),
      fullName: orm.fullName,
      password: Password.fromHash(orm.password),
      createdAt: orm.createdAt,
    });
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id.toString();
    orm.email = user.email.toString();
    orm.fullName = user.fullName;
    orm.password = user.passwordHash;
    orm.createdAt = user.createdAt;
    return orm;
  }
}
