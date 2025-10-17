import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend on port 3002
  app.enableCors({
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Hybrid ORM Blog API - TypeORM + Drizzle             ║
║                                                            ║
║   Backend API: http://localhost:${port}                       ║
║   Frontend UI: http://localhost:3002                       ║
║                                                            ║
║   TypeORM manages:  Users, Posts                          ║
║   Drizzle manages:  Comments, Tags                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
