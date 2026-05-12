import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const connectionString =
      this.configService.get<string>('DATABASE_URL') ||
      this.configService.get<string>('SUPABASE_DB_URL') ||
      this.configService.get<string>('DB_URL');

    const sslEnabled =
      this.configService.get<string>('DB_SSL') === 'true' ||
      this.configService.get('NODE_ENV') === 'production';
    const ssl = sslEnabled ? { rejectUnauthorized: false } : false;

    if (connectionString) {
      this.pool = new Pool({ connectionString, ssl });
      return;
    }

    this.pool = new Pool({
      host: this.configService.get('DB_HOST', 'localhost'),
      user: this.configService.get('DB_USER', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'password'),
      database: this.configService.get('DB_NAME', 'EntaElEin'),
      port: Number.parseInt(
        String(this.configService.get('DB_PORT', 5432)),
        10,
      ),
      ssl,
    });
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
