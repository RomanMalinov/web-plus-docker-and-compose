import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Мир во всем мире!';
  }

  getAppInfo(): { name: string; version: string } {
    return {
      name: 'KupiPodariDay API',
      version: '1.0.0',
    };
  }
}
