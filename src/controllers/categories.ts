import { Category, Product, UserRole } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';
const logger = createLogger('categories-controller');
import { getOrThrow } from '../utils/validate';
import { categorySchema } from '../validation/categorySchema';
import store from '../store';
import { authenticate, authorize, auth } from '../middleware/auth';
import { idSchema } from '../validation/idShema';

const categoriesRouter = express.Router();

categoriesRouter.get('/',
    authenticate(),
    (req, res, next) => {
        logger.info('Someone requested categories!!');
        res.send(store.categories);
});

categoriesRouter.get('/:id/products',
    authenticate(),
    (req, res) => {
        const id = getOrThrow<number>(req.params.id, categorySchema);
        if (id) {
            const categories: Category[] = store.categories;
            const category: Category = categories[id];
            const productsRes: Product[] = store.products;
            const result: Product[]  = productsRes.filter( p => p.categoryId === category.id );
            res.send(result);
        }
        res.sendStatus(404);
        return;
});

categoriesRouter.get('/:id',
    authenticate(), 

    (req, res, next) => {
        const id = getOrThrow<number>(req.params.id, categorySchema);

        const category = store.categories.find(o => o.id === id);
        if (!category) {
          res.sendStatus(404);
          return;
        }
        res.send(category);
});

function checkNameMinChart(req: Request, res: Response, next: NextFunction) {
    const category: Category = req.body;
    const { name } = category;
    if ( name.length < 3 ) {
        res.sendStatus(409);
        return;
    }
    next();
}

categoriesRouter.post('/',
    authenticate(),
    authorize(UserRole.Admin),
    checkNameMinChart,
    (req, res, next) => {
    const category = getOrThrow<Category>(req.body, categorySchema);
    if (category) {
        category.id = store.categories.length + 1;
        store.categories.push(category);
        res.status(201).send(category);
    }
    res.sendStatus(404);
    return;
});

categoriesRouter.put('/:id',
    auth(UserRole.Admin), 
    checkNameMinChart,
    (req, res, next) => {
        const id = getOrThrow<number>(req.params.id, idSchema);
        const category = getOrThrow<Category>(req.body, categorySchema);
        if (category && id) {
            category.id = id;

            const existing = store.categories.find(o => o.id === id);
            if (!existing) {
              res.sendStatus(404);
              return;
            }

            Object.assign(existing, category);
            res.send(existing);
        }
        res.sendStatus(404);
        return;
});

categoriesRouter.delete('/:id',
    authenticate(),
    authorize(UserRole.Admin),
    (req, res, next) => {
        const id = getOrThrow<number>(req.params.id, idSchema);
        const existingIndex = store.categories.findIndex(o => o.id === id);
        if (existingIndex < 0) {
          res.sendStatus(404);
          return;
        }
        store.categories.splice(existingIndex, 1);
        res.sendStatus(204);
  });

export default categoriesRouter;
