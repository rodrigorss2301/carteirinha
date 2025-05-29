import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/entities/role.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Se não houver roles definidas, permite o acesso
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role); // Verifica se o usuário tem a role necessária
  }
}
