export const getWebHookParams = (hookName: string, response: any) => {
  switch (hookName) {
    case 'CompaniesController.removeCompany':
      return { companyRef: response.id };
    case 'VehiclesController.removeVehicle':
      return { vin: response.vin, companyRef: response.companyId };
    case 'VehiclesController.createVehicle':
      return { companyRef: response.companyId };
    default:
      return null;
  }
};
