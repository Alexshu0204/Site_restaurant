import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type JwtUser = {
  sub?: number;
  userId?: number;
};

type RequestWithUser = {
  user?: JwtUser;
  params: {
    id?: string;
  };
};

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Extract request information (JWT user + :id route parameter)
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // The authenticated user id from JWT payload (prefer sub, fallback userId)
    const jwtUserId = request.user?.sub ?? request.user?.userId;
    if (!jwtUserId) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    // The target id from URL parameter /users/:id
    const routeUserId = Number(request.params.id);
    if (!Number.isInteger(routeUserId)) {
      throw new ForbiddenException('Invalid user id in route parameter.');
    }

    // Allow access only when the JWT user id matches the route user id
    if (jwtUserId !== routeUserId) {
      throw new ForbiddenException('You can only access your own profile.');
    }

    return true;
  }
}
