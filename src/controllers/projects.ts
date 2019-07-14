import { Project } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import uuidv1 from 'uuid/v1';
import { router as projectMembersRouter } from './project-members';

// TODO: move elsewhere
const projects: Project[] = [
  { id: uuidv1(), name: 'CodeResource' },
  { id: uuidv1(), name: 'CodeStat' },
  { id: uuidv1(), name: 'Microfost' },
  { id: uuidv1(), name: 'Macbook Pro' },
  { id: uuidv1(), name: 'Ipad' },
  { id: uuidv1(), name: 'Macbook Pro 2010' },
  { id: uuidv1(), name: 'Iphone X' },
  { id: uuidv1(), name: 'Iphone 7' },
  { id: uuidv1(), name: 'Pavilion' },
  { id: uuidv1(), name: 'Lenovo' },
  { id: uuidv1(), name: 'Mouse Microsoft' },
  { id: uuidv1(), name: 'AirPods' },
];

function findProjectIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  const matchingIndex = projects.findIndex(p => p.id === id);

  if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.matchingIndex = matchingIndex;
  next();
}

const router = express.Router();

router.use('/:projectId/members', projectMembersRouter);

router.get('/', (req, res, next) => res.send(projects));

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const matching = projects.find(p => p.id === id);

  if (!matching) {
    res.sendStatus(404);
    return;
  }

  res.send(matching);
});

router.post('/', (req, res) => {
  const project: Project = req.body;
  project.id = uuidv1();

  projects.push(project);
  res.status(201).send(project);
});

router.put('/:id',
  findProjectIndexOrNotFound,
  (req, res) => {
    const { id } = req.params;
    const project: Project = req.body;
    project.id = id;

    projects[res.locals.matchingIndex] = project;
    res.status(200).send(project);
  },
);

router.delete('/:id',
  findProjectIndexOrNotFound,
  (req, res) => {
    projects.splice(res.locals.matchingIndex, 1);
    res.sendStatus(204);
  },
);

export { router };
