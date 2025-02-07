import * as winston from 'winston';

import { join } from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: join(__dirname, '..', '..', '..', '..', 'logs', 'info.log'),
    }),
  ],
});

export const writeLogError = (whichError: string, error: any) => {
  logger.info({
    message: `${whichError}`,
    error: JSON.stringify(error),
  });
};
