import { Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { productSchema } from '../validation/productSchema';
import { getOrThrow } from '../utils/validate';
import { createLogger } from '../utils/logger';
import uuidv1 from 'uuid/v1';
import { products } from "../data/products";
const logger = createLogger('products-controller');
const productsRouter = express.Router();

export function loadProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

export function loadProductsMw(req: Request, res: Response, next: NextFunction) {
  loadProducts()
    .then(products => {
      res.locals.products = products;
      next();
    })
    .catch(next);
}

export function resolveProductsFromResponse(res: Response) {
  return res.locals.products;
}

// const productsRes = addUuidToArray(products);
async function findProjectIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if ( id.length < 36) {
        res.sendStatus(400);
        return;
    }

    const products = await loadProducts();
    const matchingIndex =  products.findIndex(p => p.id === id);
    if (matchingIndex < 0) {
        res.sendStatus(404);
        return;
    }

    res.locals.matchingIndex = matchingIndex;
    next();
  } catch (err) {
    next(err);
  }
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

productsRouter.get('/',
  loadProductsMw,
  (req, res, next) => {
    logger.info('Someone requested projects!!');
    const productsRes = resolveProductsFromResponse(res);
    res.send(productsRes);
  });

productsRouter.get('/:id',
findProjectIndexOrNotFound,
async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Someone requested project id: ', id);
    const matching = (await loadProducts()).find(p => p.id === id);
    if (!matching) {
      res.sendStatus(404);
      return;
    }

    res.send(matching);
  } catch (err) {
    next(err);
  }
});

productsRouter.post('/', checkNameMinChart, async (req, res, next) => {
    const product: Product = req.body;
    product.id = uuidv1();

    await loadProducts()
    .then(products => {
      products.push(product);
      res.status(201).send(product);
    })
    .catch(next);
});

productsRouter.put('/:id',
  findProjectIndexOrNotFound,
  checkNameMinChart,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      logger.info('Someone upodate project id: ', id);

      const project = getOrThrow<Product>(req.body, productSchema, next);

      if (project) {
        project.id = id;
        const projects = await loadProducts();
        projects[res.locals.matchingIndex] = project;
        res.status(200).send(project);
      }
    } catch (err) {
      next(err);
    }
  },
);

productsRouter.delete('/:id',
  findProjectIndexOrNotFound,
  async (req, res, next) => {
    await loadProducts()
    .then(products => {
      logger.info('Someone delete project id: ', products[res.locals.matchingIndex].id);
      products.splice(res.locals.matchingIndex, 1);
      res.sendStatus(204);
    })
    .catch(next);
  });

export { productsRouter };
