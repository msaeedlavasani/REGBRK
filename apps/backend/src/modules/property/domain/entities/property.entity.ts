import { PropertyId } from '../value-objects/property-id.vo';
import { Money } from '../value-objects/money.vo';
import { PropertyType } from '../value-objects/property-type.enum';
import { PropertyStatus } from '../value-objects/property-status.enum';

export interface PropertyProps {
  id: PropertyId;
  title: string;
  address: string;
  price: Money;
  type: PropertyType;
  area: number;
  roomsCount: number;
  status: PropertyStatus;
  ownerId: string;
  createdAt: Date;
}

export class Property {
  private readonly props: PropertyProps;

  private constructor(props: PropertyProps) {
    this.props = props;
  }

  static create(params: {
    title: string;
    address: string;
    price: number;
    type: PropertyType;
    area: number;
    roomsCount: number;
    ownerId: string;
  }): Property {
    if (!params.title || params.title.trim().length < 3) {
      throw new Error('title must be at least 3 characters long');
    }
    if (!params.address || params.address.trim().length < 3) {
      throw new Error('address must be at least 3 characters long');
    }
    if (!params.area || params.area <= 0) {
      throw new Error('area must be greater than zero');
    }
    if (!Number.isInteger(params.roomsCount) || params.roomsCount < 0) {
      throw new Error('roomsCount must be a non-negative integer');
    }
    if (!params.ownerId || params.ownerId.trim().length === 0) {
      throw new Error('ownerId is required');
    }

    return new Property({
      id: PropertyId.create(),
      title: params.title.trim(),
      address: params.address.trim(),
      price: Money.create(params.price),
      type: params.type,
      area: params.area,
      roomsCount: params.roomsCount,
      status: PropertyStatus.ACTIVE,
      ownerId: params.ownerId,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: PropertyProps): Property {
    return new Property(props);
  }

  get id(): PropertyId {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get address(): string {
    return this.props.address;
  }

  get price(): Money {
    return this.props.price;
  }

  get type(): PropertyType {
    return this.props.type;
  }

  get area(): number {
    return this.props.area;
  }

  get roomsCount(): number {
    return this.props.roomsCount;
  }

  get status(): PropertyStatus {
    return this.props.status;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
