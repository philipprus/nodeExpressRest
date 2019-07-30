import { Project, User, UserCredential, UserRole, Product, Category } from '../models';

interface StoreType {
  products: Product[];
  categories: Category[];
  users: User[];
  projects: Project[];
  credentials: UserCredential[];
}

const store: StoreType = {
      products: [
            {
                  id: 1, 
                  categoryId: 1,
                  name: 'CodeResource',
                  itemsInStock: 10
            },
            {
                  id: 2, 
                  categoryId: 1,
                  itemsInStock: 1,
                  name: 'CodeStat'
            },
            {
                  id: 3, 
                  categoryId: 2,
                  itemsInStock: 100,
                  name: 'Microsoft'
            },
            {
                  id: 4,
                  categoryId: 3,
                  itemsInStock: 20,
                  name: 'Macbook Pro'
            },
            {
                  id: 5, 
                  categoryId: 3,
                  itemsInStock: 14,
                  name: 'Ipad'
            },
            {
                  id: 6, 
                  categoryId: 3,
                  itemsInStock: 40,
                  name: 'Macbook Pro 2010'
            },
            {
                  id: 7, 
                  categoryId: 3,
                  itemsInStock: 70,
                  name: 'Iphone X'
            },
            {
                  id: 8, 
                  categoryId: 3,
                  itemsInStock: 643,
                  name: 'Iphone 7'
            },
            {
                  id: 9, 
                  categoryId: 3,
                  itemsInStock: 10,
                  name: 'Pavilion'
            }
      ],
      categories: [
            {
                id: 1,
                name: "CodeValue"
            },
            {
                id: 2,
                name: "Microsoft"
            }, 
            {
                id: 3,    
                name: "Apple"
            }
      ],
      users: [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' },
      ],
      credentials: [
            { email: 'a', password: 'a', userId: 1, roles: [UserRole.Reader] },
            { email: 'b', password: 'b', userId: 2, roles: [UserRole.Contributor] },
            { email: 'c', password: 'c', userId: 3, roles: [UserRole.Admin] },
      ],
      projects: [
            { id: 1, name: 'CVPark' },
            { id: 2, name: 'CodeResource' },
          ]
};

export default store;
