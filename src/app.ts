import express from 'express';
import cors from 'cors';
import { router as projectsRouter } from './controllers/projects';
import { productsRouter } from './controllers/products';
import { categoriesRouter } from './controllers/categories';
import expressWinston from 'express-winston';
import winston from 'winston';
import { joiError } from './utils/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const {
      timestamp, level, message, ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

app.use(expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: alignedWithColorsAndTime,
}));

app.use('/api/projects', projectsRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.use(joiError);

app.use(expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
}));

export {
  app,
};
