import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseService, Roles } from '../database/database.service';
import { UseRoles } from '../auth/roles/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@ApiBearerAuth()
@UseRoles(Roles.ADMIN)
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly DBContext: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.db.pingCheck('database', this.DBContext),
    ]);
  }
}
