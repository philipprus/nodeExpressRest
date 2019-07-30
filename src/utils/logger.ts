import winston from 'winston';

export const createExpressWinstonOptions = () => ({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
});

const createLogger = (name: string) => {
  return winston.createLogger({
    transports: [
      new winston.transports.Console(),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    defaultMeta: {
      name,
    },
  });
};

export { createLogger };
