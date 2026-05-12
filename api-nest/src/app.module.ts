import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { RegionModule } from './features/region/region.module';
import { HadasModule } from './features/hadas/hadas.module';
import { FeedbackModule } from './features/feedback/feedback.module';
import { ParticipantModule } from './features/participant/participant.module';
import { AlertsModule } from './features/alerts/alerts.module';
import { ReportModule } from './features/report/report.module';
import { InvolvedInModule } from './features/involvedin/involvedin.module';
import { AlertedByModule } from './features/alertedby/alertedby.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/graphql',
      context: ({ req }) => ({ req }),
    }),
    UsersModule,
    AuthModule,
    RegionModule,
    HadasModule,
    FeedbackModule,
    ParticipantModule,
    AlertsModule,
    ReportModule,
    InvolvedInModule,
    AlertedByModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // Apply request logging middleware across all routes.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
