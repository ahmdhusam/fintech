import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron() {
    const nowInMilli = Date.now();
    const twoDaysInMilli = 2 * 24 * 60 * 60 * 1000;
    const twoDaysUntilNowInMilli = nowInMilli - twoDaysInMilli;

    const transactions = await this.transactionsService.getPending({
      createdAt: {
        // @ts-ignore
        lt: new Date(twoDaysUntilNowInMilli),
      },
    });

    await Promise.all(
      transactions.map((transaction) =>
        this.transactionsService.transfer(
          transaction.id,
          transaction.toAccountId,
          transaction.amount,
        ),
      ),
    );
    this.logger.log(`handleCron: ${JSON.stringify(transactions)}`);
  }
}
