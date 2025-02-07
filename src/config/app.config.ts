import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { description, name, version } from 'src/../package.json';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

import CorsConfig from './cors.config';

export class AppInitializer {
  constructor(
    private readonly app: NestExpressApplication,
    private readonly configService: ConfigService,
  ) {}

  initialize(): void {
    this.setupCors();
    this.setupGlobalConfigs();
    this.setupSwagger();
    this.setupHelmet();
    this.startApplication();
  }

  private startApplication(): void {
    const port = this.configService.get<number>('APP_PORT', { infer: true });
    this.app.listen(port, () => console.log(`[+] http://localhost:${port}`));
  }

  private setupCors(): void {
    const corsConfig = new CorsConfig(this.configService);
    this.app.enableCors(corsConfig.getConfig());
  }

  private setupGlobalConfigs(): void {
    this.app.setGlobalPrefix('api');
    this.app.useGlobalFilters(new HttpExceptionFilter());
    this.app.useBodyParser('json', { limit: '100mb' });
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
  }

  private setupSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addBasicAuth({
        type: 'http',
        scheme: 'basic',
        bearerFormat: 'Base64',
      })
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    return SwaggerModule.setup('docs', this.app, document);
  }

  private setupHelmet() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com'],
            objectSrc: ["'none'"],
          },
        },
        frameguard: {
          action: 'deny',
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        dnsPrefetchControl: false,
        hidePoweredBy: true,
        ieNoOpen: true,
        noSniff: true,
        xssFilter: true,
      }),
    );
  }
}

/**
 * setupHelmet
 *
 * @param contentSecurityPolicy     CSP ajuda a detectar e mitigar certos tipos de ataques, como XSS (Cross-Site Scripting) e data injection attacks.
 * @param hsts                      Define o header Strict-Transport-Security para 1 ano
 * @param dnsPrefetchControl        Desativa o controle de prefetch de DNS
 * @param hidePoweredBy             Remove o cabeçalho 'X-Powered-By'
 * @param ieNoOpen                  Define o header X-Download-Options para IE8+
 * @param noSniff                   Define o header X-Content-Type-Options para 'nosniff'
 * @param xssFilter                 Ativa o filtro XSS do navegador
 */
