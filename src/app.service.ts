// app.service.ts is a simple service that provides a method to return a greeting
// message. It is used by the AppController to respond to HTTP requests.

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
