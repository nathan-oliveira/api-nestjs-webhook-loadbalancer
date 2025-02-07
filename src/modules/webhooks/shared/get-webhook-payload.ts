import { ConfigService } from '@nestjs/config';

export const getWebHookPayload = (
  configService: ConfigService,
  hookName: string,
  response: any,
) => {
  switch (hookName) {
    case 'CompaniesController.createCompany':
      const password = configService.get<string>('WEBHOOK_PASSWORD');
      const username = configService.get<string>('WEBHOOK_USERNAME');
      const callbackUrl = configService.get<string>(
        'WEBHOOK_CALLBACK_COMPANY_URL',
      );
      return {
        company: {
          callbackUrl,
          password,
          username,
          id: response.id,
        },
      };
    case 'VehiclesController.createVehicle':
      return {
        vehicle: {
          companyRef: response.companyId,
          vin: response.vin,
          fuelLevel: response.fuelLevel,
        },
      };
    default:
      return {};
  }
};
