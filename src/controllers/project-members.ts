import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', (req, res) => res.send('Members'));

export { router };
