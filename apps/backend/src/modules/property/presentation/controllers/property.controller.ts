import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePropertyUseCase } from '../../application/commands/create-property.use-case';
import { ListPropertiesUseCase } from '../../application/queries/list-properties.use-case';
import { GetPropertyByIdUseCase } from '../../application/queries/get-property-by-id.use-case';
import { PropertyNotFoundError } from '../../application/errors/property-not-found.error';
import { CreatePropertyRequestDto } from '../dto/create-property-request.dto';
import { PropertyResponseDto } from '../dto/property-response.dto';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../identity-access/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../identity-access/presentation/decorators/current-user.decorator';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
    private readonly getPropertyByIdUseCase: GetPropertyByIdUseCase,
  ) {}

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

  @Get()
  @ApiResponse({ status: 200, type: [PropertyResponseDto] })
  async list(): Promise<PropertyResponseDto[]> {
    const properties = await this.listPropertiesUseCase.execute();
    return properties.map((property) =>
      PropertyResponseDto.fromDomain(property),
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PropertyResponseDto })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PropertyResponseDto> {
    try {
      const property = await this.getPropertyByIdUseCase.execute(id);
      return PropertyResponseDto.fromDomain(property);
    } catch (error) {
      if (error instanceof PropertyNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
