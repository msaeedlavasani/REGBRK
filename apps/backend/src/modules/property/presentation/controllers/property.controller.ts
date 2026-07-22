import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePropertyUseCase } from '../../application/commands/create-property.use-case';
import { CreatePropertyRequestDto } from '../dto/create-property-request.dto';
import { PropertyResponseDto } from '../dto/property-response.dto';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../identity-access/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../identity-access/presentation/decorators/current-user.decorator';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: PropertyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreatePropertyRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PropertyResponseDto> {
    const property = await this.createPropertyUseCase.execute({
      ...dto,
      ownerId: user.userId,
    });
    return PropertyResponseDto.fromDomain(property);
  }
}
