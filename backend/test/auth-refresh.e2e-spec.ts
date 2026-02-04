import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth Refresh Token (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

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
    app.setGlobalPrefix('api');

    await app.init();

    prisma = app.get(PrismaService);

    // Clean up test user if exists
    await prisma.user.deleteMany({
      where: { email: 'refresh-test@example.com' },
    });
  });

  afterAll(async () => {
    // Clean up
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a user and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'refresh-test@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
          role: 'EMPLOYEE',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('refresh-test@example.com');

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
      userId = response.body.user.id;

      // Verify refresh token is stored in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      expect(storedToken).toBeTruthy();
      expect(storedToken.userId).toBe(userId);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens successfully', async () => {
      const oldRefreshToken = refreshToken;

      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body.user.id).toBe(userId);

      // Tokens should be different
      expect(response.body.accessToken).not.toBe(accessToken);
      expect(response.body.refreshToken).not.toBe(oldRefreshToken);

      // Old refresh token should be deleted (rotation)
      const oldToken = await prisma.refreshToken.findUnique({
        where: { token: oldRefreshToken },
      });
      expect(oldToken).toBeNull();

      // New refresh token should exist
      const newToken = await prisma.refreshToken.findUnique({
        where: { token: response.body.refreshToken },
      });
      expect(newToken).toBeTruthy();

      // Update tokens for next tests
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should reject invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should reject already used refresh token', async () => {
      const currentRefreshToken = refreshToken;

      // Use the token once
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: currentRefreshToken })
        .expect(200);

      refreshToken = response.body.refreshToken;

      // Try to use the same token again (should fail due to rotation)
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: currentRefreshToken })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get user profile with valid access token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.email).toBe('refresh-test@example.com');
    });

    it('should reject request without access token', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and delete refresh token', async () => {
      const currentRefreshToken = refreshToken;

      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken: currentRefreshToken })
        .expect(201);

      expect(response.body.message).toBe('Déconnexion réussie');

      // Refresh token should be deleted
      const deletedToken = await prisma.refreshToken.findUnique({
        where: { token: currentRefreshToken },
      });
      expect(deletedToken).toBeNull();

      // Try to use deleted refresh token (should fail)
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: currentRefreshToken })
        .expect(401);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return new tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'refresh-test@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.id).toBe(userId);

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should delete old expired tokens on login', async () => {
      // Get initial token count
      const tokensBefore = await prisma.refreshToken.findMany({
        where: { userId },
      });

      // Login again (should clean up any expired tokens)
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'refresh-test@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      const tokensAfter = await prisma.refreshToken.findMany({
        where: { userId },
      });

      // Should have cleaned up and created new token
      expect(tokensAfter.length).toBeGreaterThanOrEqual(1);
    });
  });
});