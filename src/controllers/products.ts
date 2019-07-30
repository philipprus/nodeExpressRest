import { Product, UserRole } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { productSchema } from '../validation/productSchema';
import { getOrThrow } from '../utils/validate';
import { createLogger } from '../utils/logger';
import store from '../store';
import { auth } from '../middleware/auth';
import { idSchema } from '../validation/idShema';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
const logger = createLogger('products-controller');
const productsRouter = express.Router();

function checkNameMinChart(req: Request, res: Response, next: NextFunction) {
    const product: Product = req.body;
    const { name } = product;
    if ( name.length < 3 ) {
        res.sendStatus(409);
        return;
    }
    next();
}

productsRouter.get('/',
  authenticate(),
  (req, res, next) => {
    logger.info('Products requested');
    res.send(store.products);
  });

productsRouter.get('/:id',
  authenticate(),
  (req, res, next) => {
    const id = getOrThrow<number>(req.params.id, idSchema);
    const product = store.products.find((o: { id: number | undefined; }) => o.id === id);
    if (!product) {
      res.sendStatus(404);
      return;
    }
    res.send(product);
});

productsRouter.post('/', checkNameMinChart, authenticate(), authorize(UserRole.Admin), (req, res, next) => {
    const product = getOrThrow<Product>(req.body, productSchema);
    if (product) {
      product.id = store.products.length + 1;
      store.products.push(product);
      res.status(201).send(product);
    }
    res.sendStatus(404);
    return;
});

productsRouter.put('/:id',
  authenticate(),
  auth(UserRole.Admin),
  checkNameMinChart,
  (req, res, next) => {
    const id = getOrThrow<number>(req.params.id, idSchema);
    const product = getOrThrow<Product>(req.body, productSchema);
    if (product && id) {
        product.id = id;
        const existing = store.products.find((o: { id: number; }) => o.id === id);
        if (!existing) {
          res.sendStatus(404);
          return;
        }
        Object.assign(existing, product);
        res.send(existing);
    }

    res.sendStatus(404);
    return;
  },
);

productsRouter.delete('/:id',
  authenticate(), authorize(UserRole.Admin),
  (req, res, next) => {
    const id = getOrThrow<number>(req.params.id, idSchema);
    const existingIndex = store.products.findIndex((o: { id: number | undefined; }) => o.id === id);
    if (existingIndex < 0) {
      res.sendStatus(404);
      return;
    }
    store.products.splice(existingIndex, 1);
    res.sendStatus(204);
  });

export default productsRouter;
