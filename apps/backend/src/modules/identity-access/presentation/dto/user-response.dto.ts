import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/value-objects/user-role.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id.toString();
    dto.email = user.email.toString();
    dto.fullName = user.fullName;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
