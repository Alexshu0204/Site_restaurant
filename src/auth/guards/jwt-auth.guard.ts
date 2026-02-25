import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// The JwtAuthGuard is a simple wrapper around the Passport.js JWT authentication strategy.
// It uses the 'jwt' strategy defined in the JwtStrategy class to authenticate requests.
// By applying this guard to routes, we can protect them and ensure that only authenticated
// users with valid JWT tokens can access those routes.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}