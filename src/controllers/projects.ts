import { Project } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import uuidv1 from 'uuid/v1';
import { router as projectMembersRouter } from './project-members';
import { getOrThrow } from '../utils/validate';
import { projectSchema } from '../validation/projectScheme';
import { createLogger } from '../utils/logger';

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


// TODO: move elsewhere
function loadProjects(): Promise<Project[]> {
  return Promise.resolve(projects);
}

function loadProjectsMw(req: Request, res: Response, next: NextFunction) {
  loadProjects()
    .then(projects => {
      res.locals.projects = projects;
      next();
    })
    .catch(next);
}

function resolveProjectsFromResponse(res: Response) {
  return res.locals.projects;
}

async function findProjectIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const matchingIndex = (await loadProjects()).findIndex(p => p.id === id);

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

const logger = createLogger('projects-controller');
const router = express.Router();

router.use('/:projectId/members', projectMembersRouter);

router.get('/',
  loadProjectsMw,
  (req, res, next) => {
    logger.info('Someone requested projects!!');
    const projects = resolveProjectsFromResponse(res);
    res.send(projects);
  },
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const matching = (await loadProjects()).find(p => p.id === id);

    if (!matching) {
      res.sendStatus(404);
      return;
    }

    res.send(matching);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  const project: Project = req.body;
  project.id = uuidv1();

  loadProjects()
    .then(projects => {
      projects.push(project);
      res.status(201).send(project);
    })
    .catch(next);
});

router.put('/:id',
  findProjectIndexOrNotFound,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = getOrThrow<Project>(req.body, projectSchema, next);

      if (project) {
        project.id = id;

        const projects = await loadProjects();
        projects[res.locals.matchingIndex] = project;
        res.status(200).send(project);
      }
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/:id',
  findProjectIndexOrNotFound,
  (req, res, next) => {
    loadProjects()
      .then(projects => {
        projects.splice(res.locals.matchingIndex, 1);
        res.sendStatus(204);
      })
      .catch(next);
  },
);

export { router };
