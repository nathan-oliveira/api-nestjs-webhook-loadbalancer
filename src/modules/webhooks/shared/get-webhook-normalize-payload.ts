import { JSONPath } from 'jsonpath-plus';

const normalizePayloadPath = (json: object, pathMap: string) => {
  if (typeof pathMap !== 'string') return pathMap;

  const potentialPaths = pathMap
    .split(' ')
    .filter((part) => part.startsWith('$.'));

  return potentialPaths.reduce((finalValue, path) => {
    return finalValue.replace(path, JSONPath({ path, json, wrap: false }));
  }, pathMap);
};

const convertValuePath = (hookName: string, key: string, value: string) => {
  switch (hookName) {
    case 'VehiclesController.createVehicle':
      if (key === 'fuelLevel') return Number(value);
      return value;
    default:
      return value;
  }
};

export const getWebHookNormalizePayload = (
  hookName: string,
  payloadMap: object,
  webhookEventPayload: any,
) => {
  if (!payloadMap) return webhookEventPayload;
  return Object.entries(payloadMap).reduce((payload, [keyMap, pathMap]) => {
    const valuePath = normalizePayloadPath(webhookEventPayload, pathMap);
    const value = convertValuePath(hookName, keyMap, valuePath);
    return { ...payload, [keyMap]: value };
  }, {});
};
