import { Category, Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import { categories } from '../data/categories';
import { createLogger } from '../utils/logger';
const logger = createLogger('categories-controller');
import uuidv1 from 'uuid/v1';
import { getOrThrow } from '../utils/validate';
import { categorySchema } from '../validation/categorySchema';
import { loadProductsMw, resolveProductsFromResponse } from './products';

const categoriesRouter = express.Router();

function loadCategories(): Promise<Category[]> {
    return Promise.resolve(categories);
}

function loadCategoriesMw(req: Request, res: Response, next: NextFunction) {
    loadCategories()
        .then(categories => {
        res.locals.categories = categories;
        next();
        })
        .catch(next);
}

function resolveCategoriesFromResponse(res: Response) {
    return res.locals.categories;
}

async function findCategoryIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if ( id.length < 36) {
          res.sendStatus(400);
          return;
      }
      
      const categories = await loadCategories();
      const matchingIndexCat =  categories.findIndex(p => p.id === id);
      if (matchingIndexCat < 0) {
          res.sendStatus(404);
          return;
      }

      res.locals.matchingIndexCat = matchingIndexCat;
      next();
    } catch (err) {
      next(err);
    }
}

categoriesRouter.get('/',
    loadCategoriesMw,
    (req, res, next) => {
        logger.info('Someone requested categories!!');
        const categories = resolveCategoriesFromResponse(res);
        res.send(categories);
});

categoriesRouter.get('/:id/products',
    findCategoryIndexOrNotFound,
    loadProductsMw,
    loadCategoriesMw,
    (req, res) => {
        const categories: Category[] = resolveCategoriesFromResponse(res);
        const category: Category = categories[res.locals.matchingIndexCat];
        const productsRes: Product[] = resolveProductsFromResponse(res);
        const result: Product[]  = productsRes.filter( p => p.categoryId === category.name );
        res.send(result);
});

categoriesRouter.get('/:id',
loadCategoriesMw,
findCategoryIndexOrNotFound,
 async (req, res, next) => {
  try {
    const categories: Category[] = resolveCategoriesFromResponse(res);
    const matching = categories[res.locals.matchingIndexCat];
    if (!matching) {
      res.sendStatus(404);
      return;
    }
    res.send(matching);
  } catch (err) {
    next(err);
  }
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

categoriesRouter.post('/',  checkNameMinChart, async (req, res, next) => {
    const category: Category = req.body;
    category.id = uuidv1();
    await loadCategories()
        .then(categories => {
            categories.push(category);
            res.status(201).send(category);
        })
        .catch(next);
});

categoriesRouter.put('/:id',
    checkNameMinChart,
    findCategoryIndexOrNotFound,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = getOrThrow<Category>(req.body, categorySchema, next);

            if (category) {
            category.id = id;

            const categories = await loadCategories();
            categories[res.locals.matchingIndexCat] = category;
            res.status(200).send(category);
            }
        } catch (err) {
            next(err);
        }
    },
);

categoriesRouter.delete('/:id',
findCategoryIndexOrNotFound,
  async (req, res, next) => {
    await loadCategories()
    .then( categories => {
        logger.info('Someone delete categories id: ', categories[res.locals.matchingIndex].id);

        categories.splice(res.locals.matchingCatIndex, 1);
        res.sendStatus(204);
    })
    .catch(next);
  });

export { categoriesRouter };
