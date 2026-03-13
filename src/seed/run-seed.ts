import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrapSeed(): Promise<void> {
  const logger = new Logger('SeedRunner');
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    throw new Error('Seed bloque: NODE_ENV=production.');
  }

  if (process.env.SEED_ENABLED !== 'true') {
    throw new Error('Seed bloque: SEED_ENABLED doit etre "true".');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const seedService: SeedService = app.get(SeedService, { strict: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await seedService.seed();
    logger.log('Seed execute avec succes.');
  } finally {
    await app.close();
  }
}

void bootstrapSeed();
