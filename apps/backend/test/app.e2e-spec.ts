/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

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

  it('POST /users should register a new user (201)', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'E2E Test User' })
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
      .send({ email, fullName: 'First User' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Second User' })
      .expect(409);
  });

  it('POST /users should reject invalid email (400)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'not-an-email', fullName: 'Bad Email User' })
      .expect(400);
  });

  it('GET /users/:id should return the user (200)', async () => {
    const email = `e2e-get-${Date.now()}@example.com`;

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ email, fullName: 'Get Test User' })
      .expect(201);

    const created = createResponse.body as { id: string };

    const getResponse = await request(app.getHttpServer())
      .get(`/users/${created.id}`)
      .expect(200);

    const body = getResponse.body as { id: string; email: string };
    expect(body.id).toBe(created.id);
    expect(body.email).toBe(email);
  });

  it('GET /users/:id should return 404 when user does not exist', async () => {
    const randomId = '11111111-1111-1111-1111-111111111111';

    await request(app.getHttpServer()).get(`/users/${randomId}`).expect(404);
  });

  it('GET /users/:id should return 400 for invalid UUID', async () => {
    await request(app.getHttpServer()).get('/users/not-a-uuid').expect(400);
  });
});
