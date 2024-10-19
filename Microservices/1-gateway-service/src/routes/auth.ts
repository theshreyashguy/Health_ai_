import { CurrentUser } from '@gateway/controllers/auth/current-user';
import { AuthSeed } from '@gateway/controllers/auth/seed';
import { SignIn } from '@gateway/controllers/auth/signin';
import { SignUp } from '@gateway/controllers/auth/signup';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/currentuser',CurrentUser.prototype.read);
    this.router.post('/auth/signup', SignUp.prototype.create);
    this.router.post('/auth/signin', SignIn.prototype.read);
    this.router.put('/auth/seed/:count', AuthSeed.prototype.create);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
