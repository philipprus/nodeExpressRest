import { Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { addUuidToArray } from '../service/common';
import products from '../data/products.json';
import uuidv4 from 'uuid/v4';

const productsRouter = express.Router();

const productsRes = addUuidToArray(products);

function findProjectIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if ( id.length < 36) {
        res.sendStatus(400);
        return;
    }

    const matchingIndex = productsRes.findIndex(p => p.id === id);

    if (matchingIndex < 0) {
        res.sendStatus(404);
        return;
    }

    res.locals.matchingIndex = matchingIndex;
    next();
}

function checkNameMinChart(req: Request, res: Response, next: NextFunction) {
    const product: Product = req.body;
    const { name } = product;
    if ( name.length < 3 ) {
        res.sendStatus(409);
        return;
    }

    next();
}

productsRouter.get('/', (req, res, next) => res.send(productsRes));

productsRouter.get('/:id', findProjectIndexOrNotFound, (req, res) => {
    const product = productsRes[res.locals.matchingIndex];
    res.send(product);
});

productsRouter.post('/', checkNameMinChart, (req, res) => {
    const product: Product = req.body;
    product.id = uuidv4();

    productsRes.push(product);
    res.status(201).send(product);
});

productsRouter.put('/:id', 
  findProjectIndexOrNotFound,
  checkNameMinChart,
  (req, res) => {
    const product: Product = req.body;

    productsRes[res.locals.matchingIndex] = product;
    res.status(200).send(product);
  },
);

productsRouter.delete('/:id',
  findProjectIndexOrNotFound,
  (req, res) => {
    productsRes.splice(res.locals.matchingIndex, 1);
    res.sendStatus(204);
  },
);

export { productsRouter };
