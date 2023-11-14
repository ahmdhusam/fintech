import { JwtAuthGuard } from './jwt.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(JwtAuthGuard).toBeDefined();
  });
});
