import { Request, Response, NextFunction } from 'express';

export function joiError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err && err.isJoi) {
    res.status(400).send(err.details);
  } else {
    next(err);
  }
}

export function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  // tslint:disable-next-line: no-console
  console.error(err.stack);
  next(err);
}

export function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.render('error', { error: err });
}
