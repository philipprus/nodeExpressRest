import express from 'express';
import cors from 'cors';
import { router as projectsRouter } from './controllers/projects';
import { productsRouter } from './controllers/products';
import { categoriesRouter } from './controllers/categories';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/test', (req, res) => res.send('hello express'));

app.use('/api/projects', projectsRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

export {
  app,
};
