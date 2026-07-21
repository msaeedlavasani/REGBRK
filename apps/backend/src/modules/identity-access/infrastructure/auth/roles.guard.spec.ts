import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../domain/value-objects/user-role.enum';

function createMockContext(user?: {
  userId: string;
  email: string;
  role: string;
}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('should allow access when no roles are required', () => {
    const reflector = {
      getAllAndOverride: () => undefined,
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = createMockContext({
      userId: '1',
      email: 'a@example.com',
      role: UserRole.USER,
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has the required role', () => {
    const reflector = {
      getAllAndOverride: () => [UserRole.ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = createMockContext({
      userId: '1',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when user does not have the required role', () => {
    const reflector = {
      getAllAndOverride: () => [UserRole.ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = createMockContext({
      userId: '1',
      email: 'user@example.com',
      role: UserRole.USER,
    });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should deny access when there is no user on the request', () => {
    const reflector = {
      getAllAndOverride: () => [UserRole.ADMIN],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = createMockContext(undefined);

    expect(guard.canActivate(context)).toBe(false);
  });
});
