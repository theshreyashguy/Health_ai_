
import { read} from '@auth/controllers/current-user';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/currentuser', read);
  return router;
}
