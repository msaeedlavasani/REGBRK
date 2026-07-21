/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { USER_REPOSITORY } from '../src/modules/identity-access/domain/repositories/user.repository';
import type { UserRepository } from '../src/modules/identity-access/domain/repositories/user.repository';
import { User } from '../src/modules/identity-access/domain/entities/user.entity';
import { UserId } from '../src/modules/identity-access/domain/value-objects/user-id.vo';
import { Password } from '../src/modules/identity-access/domain/value-objects/password.vo';
import { UserRole } from '../src/modules/identity-access/domain/value-objects/user-role.enum';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function registerAndLogin(): Promise<{
    userId: string;
    email: string;
    accessToken: string;
  }> {
    const email = `e2e-auth-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;
    const password = 'AuthTestPass123';

    const registerResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Auth Test User', password })
      .expect(201);

    const registered = registerResponse.body as { id: string };

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const loggedIn = loginResponse.body as { accessToken: string };

    return {
      userId: registered.id,
      email,
      accessToken: loggedIn.accessToken,
    };
  }

  async function registerAdminAndLogin(): Promise<{
    userId: string;
    email: string;
    accessToken: string;
  }> {
    const email = `e2e-admin-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;
    const password = 'AdminTestPass123';

    const registerResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Admin Test User', password })
      .expect(201);

    const registered = registerResponse.body as { id: string };

    const userRepository = app.get<UserRepository>(USER_REPOSITORY);
    const domainUser = await userRepository.findById(
      UserId.fromString(registered.id),
    );
    if (!domainUser) {
      throw new Error('User not found right after registration');
    }

    const adminUser = User.reconstitute({
      id: domainUser.id,
      email: domainUser.email,
      fullName: domainUser.fullName,
      password: Password.fromHash(domainUser.passwordHash),
      role: UserRole.ADMIN,
      createdAt: domainUser.createdAt,
    });
    await userRepository.save(adminUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const loggedIn = loginResponse.body as { accessToken: string };

    return {
      userId: registered.id,
      email,
      accessToken: loggedIn.accessToken,
    };
  }

  it('POST /users should register a new user (201)', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'E2E Test User', password: 'TestPassword123' })
      .expect(201);

    const body = response.body as {
      id: string;
      email: string;
      fullName: string;
    };

    expect(body.email).toBe(email);
    expect(body.fullName).toBe('E2E Test User');
    expect(body.id).toBeDefined();
  });

  it('POST /users should reject duplicate email (409)', async () => {
    const email = `e2e-dup-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'First User', password: 'TestPassword123' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Second User', password: 'TestPassword123' })
      .expect(409);
  });

  it('POST /users should reject invalid email (400)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'not-an-email',
        fullName: 'Bad Email User',
        password: 'TestPassword123',
      })
      .expect(400);
  });

  it('GET /users/:id should return 401 without a token', async () => {
    const { userId } = await registerAndLogin();
    await request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
  });

  it('GET /users/:id should return the user with a valid token (200)', async () => {
    const { userId, email, accessToken } = await registerAndLogin();

    const getResponse = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = getResponse.body as { id: string; email: string };
    expect(body.id).toBe(userId);
    expect(body.email).toBe(email);
  });

  it('GET /users/:id should return 404 when user does not exist', async () => {
    const { accessToken } = await registerAndLogin();
    const randomId = '11111111-1111-1111-1111-111111111111';

    await request(app.getHttpServer())
      .get(`/users/${randomId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('GET /users/:id should return 400 for invalid UUID', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .get('/users/not-a-uuid')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });

  it('POST /auth/login should return a token on valid credentials (200)', async () => {
    const email = `e2e-login-${Date.now()}@example.com`;
    const password = 'LoginPass123';

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Login User', password })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const body = response.body as { accessToken: string };
    expect(body.accessToken).toBeDefined();
  });

  it('POST /auth/login should reject wrong password (401)', async () => {
    const email = `e2e-login-wrong-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Login User', password: 'CorrectPass123' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'WrongPassword' })
      .expect(401);
  });

  it('POST /auth/login should reject unknown email (401)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody-e2e@example.com', password: 'Whatever123' })
      .expect(401);
  });

  it('GET /auth/me should return 401 without a token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('GET /auth/me should return the current user profile (200)', async () => {
    const { userId, email, accessToken } = await registerAndLogin();

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body as { id: string; email: string };
    expect(body.id).toBe(userId);
    expect(body.email).toBe(email);
  });

  it('GET /users should return 403 for a non-admin user', async () => {
    const { accessToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('GET /users should return 200 with a list for an admin user', async () => {
    const { accessToken } = await registerAdminAndLogin();

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body as unknown[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
