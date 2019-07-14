import { Category, Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { addUuidToArray } from '../service/common';
import categories from '../data/categories.json';
import products from '../data/products.json';

import uuidv4 from 'uuid/v4';

const categoriesRouter = express.Router();

const categoriesRes: Category[] = addUuidToArray(categories);
const productsRes: Product[] = addUuidToArray(products);

function findCategoryIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if ( id.length < 36) {
        res.sendStatus(400);
        return;
    }

    const matchingCatIndex = categoriesRes.findIndex(p => p.id === id);

    if (matchingCatIndex < 0) {
        res.sendStatus(404);
        return;
    }

    res.locals.matchingCatIndex = matchingCatIndex;
    next();
}

categoriesRouter.get('/', (req, res, next) => res.send(categoriesRes));

categoriesRouter.get('/:id/products', findCategoryIndexOrNotFound, (req, res) => {
    const category: Category = categoriesRes[res.locals.matchingCatIndex];
    const result: Product[]  = productsRes.filter( p => p.categoryId === category.name );
    res.send(result);
});

categoriesRouter.get('/:id', findCategoryIndexOrNotFound, (req, res) => {
    const category = categoriesRes[res.locals.matchingCatIndex];
    res.send(category);
});

categoriesRouter.post('/', (req, res) => {
    const product: Category = req.body;
    product.id = uuidv4();

    categoriesRes.push(product);
    res.status(201).send(product);
});

categoriesRouter.put('/:id',
    findCategoryIndexOrNotFound,
    (req, res) => {
       const category: Category = req.body;

       categoriesRes[res.locals.matchingCatIndex] = category;
       res.status(200).send(category);
    },
);

categoriesRouter.delete('/:id',
findCategoryIndexOrNotFound,
  (req, res) => {
    categoriesRes.splice(res.locals.matchingCatIndex, 1);
    res.sendStatus(204);
  },
);

export { categoriesRouter };
