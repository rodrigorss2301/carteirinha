import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/entities/role.type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
