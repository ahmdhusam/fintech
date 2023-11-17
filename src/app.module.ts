import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './utils/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { XSSMiddleware } from './core/xss/xss-sanitizer.middleware';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards';
import { RolesGuard } from './auth/roles/roles.guard';
import { SerializeInterceptor } from './core/serialize/serialize.interceptor';
import { GlobalSerialize } from './core/dtos/global.serialize';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
  ],
  providers: [
    TasksService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new SerializeInterceptor(GlobalSerialize),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XSSMiddleware).forRoutes('*');
  }
}
