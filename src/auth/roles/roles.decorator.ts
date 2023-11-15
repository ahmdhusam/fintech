import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './roles.constants';
import { Roles } from './roles.enum';

export const UseRoles = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
