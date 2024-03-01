import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPing(): string {
    return 'Welcome to our api!';
  }
}
