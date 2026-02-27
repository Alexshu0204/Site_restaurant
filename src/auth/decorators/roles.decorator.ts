import { SetMetadata } from '@nestjs/common';

// The metadata key used by RolesGuard to read required roles from route handlers.
export const ROLES_KEY = 'roles';

// A simple decorator to declare which roles can access a route.
// Example: @Roles('admin')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
