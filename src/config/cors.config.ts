import { HttpException, HttpStatus } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export class CorsConfig {
  private static readonly EXPOSED_HEADERS = [
    'X-Total-Items',
    'X-Total-Pages',
    'X-Current-Page',
    'X-Items-Per-Page',
  ];

  private static readonly ALLOWED_METHODS = [
    'GET',
    'PUT',
    'POST',
    'DELETE',
    'UPDATE',
    'OPTIONS',
  ];

  private static readonly ALLOWED_HEADERS = [
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Accept',
    'Observe',
  ];

  constructor(private readonly configService: ConfigService) {}

  getConfig(): CorsOptions {
    const nodeEnvironment = this.getNodeEnvironment();
    if (nodeEnvironment === 'development') {
      return {
        exposedHeaders: CorsConfig.EXPOSED_HEADERS,
        origin: function (origin, callback) {
          callback(null, true);
        },
      };
    }

    const domains = this.getReleasedDomains();
    return {
      exposedHeaders: CorsConfig.EXPOSED_HEADERS,
      origin: this.createOriginValidator(domains),
      credentials: true,
      methods: CorsConfig.ALLOWED_METHODS.join(','),
      allowedHeaders: CorsConfig.ALLOWED_HEADERS.join(','),
    };
  }

  private getNodeEnvironment(): string {
    const nodeEnvironment = this.configService.get<string>('NODE_ENV');
    return nodeEnvironment.toLocaleLowerCase();
  }

  private getReleasedDomains(): string[] {
    const domains = this.configService.get<string>('CORS_RELEASED_DOMAINS');
    return domains.split(',').map((domain) => domain.trim());
  }

  private createOriginValidator(
    domains: string[],
  ): (origin: string, callback: any) => void {
    return function (origin, callback) {
      if (domains.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new HttpException('Not allowed by CORS', HttpStatus.UNAUTHORIZED),
        );
      }
    };
  }
}

export default CorsConfig;
