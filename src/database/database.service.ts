import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

export {
  User,
  Role as Roles,
  Contact,
  ContactType,
  Account,
  Transaction,
  TransactionType,
  TransactionStatus,
} from '@prisma/client';
export { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger(DatabaseService.name);
  private isConnected = false;

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.getOrThrow('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Database connected successfully');
    } catch (err) {
      this.logger.error('Database connect failed', err.stack);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.isConnected) return;

    await this.$disconnect();
    this.logger.log('Database disconnects successfully');
  }
}
