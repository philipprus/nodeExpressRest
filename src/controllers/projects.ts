import express from 'express';
import store from '../store';
import { Project, UserRole } from '../models';
import { createLogger } from '../utils/logger';
import { authenticate, authorize, auth } from '../middleware/auth';
import { getOrThrow } from '../utils/validate';
import { idSchema } from '../validation/idShema';
import { projectSchema } from '../validation/projectScheme';

const logger = createLogger('projectsController');
const router = express.Router();

// Since all routes require authentication, can actually use a router middleware instead

router.get('/',
  authenticate(),
  (req, res) => {
    logger.info('Projects requested');
    res.send(store.projects);
  });

router.get('/:id', authenticate(), (req, res) => {
  const id = getOrThrow<number>(req.params.id, idSchema);

  const project = store.projects.find(o => o.id === id);
  if (!project) {
    res.sendStatus(404);
    return;
  }
  res.send(project);
});

router.post('/', authenticate(), authorize(UserRole.Admin, UserRole.Contributor), (req, res) => {
  const project = getOrThrow<Project>(req.body, projectSchema);
  if (project) {
    project.id = store.projects.length + 1;
    store.projects.push(project);
    res.status(201).send(project);
  }
  res.sendStatus(404);
  return;
});

router.put('/:id', auth(UserRole.Admin, UserRole.Contributor), (req, res) => {
  const id = getOrThrow<number>(req.params.id, idSchema);
  const project = getOrThrow<Project>(req.body, projectSchema);
  if (project && id) {
    project.id = id;

    const existing = store.projects.find(o => o.id === id);
    if (!existing) {
      res.sendStatus(404);
      return;
    }

    Object.assign(existing, project);
    res.send(existing);
  }
  res.sendStatus(404);
  return;
});

router.delete('/:id', authenticate(), authorize(UserRole.Admin), (req, res) => {
  const id = getOrThrow<number>(req.params.id, idSchema);
  const existingIndex = store.projects.findIndex(o => o.id === id);
  if (existingIndex < 0) {
    res.sendStatus(404);
    return;
  }
  store.projects.splice(existingIndex, 1);
  res.sendStatus(204);
});

export default router;
