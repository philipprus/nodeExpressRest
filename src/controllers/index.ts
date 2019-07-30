import projects from './projects';
import productsRouter from './products';
import categoryRouter from './categories';
import users from './users';
import login from './login';

export default [
  {
      prefix: '/projects',
      router: projects,
  },
  {
      prefix: '/products',
      router: productsRouter,
  },
  {
      prefix: '/categories',
      router: categoryRouter,
  },
  {
      prefix: '/users',
      router: users,
  },
  {
      prefix: '/login',
      router: login,
  },
];
