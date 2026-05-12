import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

/**
 * Database Module
 * Centralizes database configuration using ConfigModule pattern
 * Dynamically loads TypeORM configuration from environment variables
 * Provides automatic entity loading and connection pooling
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url:
          configService.get<string>('DATABASE_URL') ||
          configService.get<string>('SUPABASE_DB_URL') ||
          configService.get<string>('DB_URL'),
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'EntaElEin'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
        ssl:
          configService.get<string>('DB_SSL') === 'true' ||
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
