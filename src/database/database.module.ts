import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';
import { User, Account } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: DatabaseService,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return new DatabaseService(config).$extends({
          result: {
            user: {
              hasAccount: {
                needs: { id: true },
                compute(user: User) {
                  return (account: Account) => user.id === account.userId;
                },
              },
            },
          },
        });
      },
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
