import { orderControllers } from '@gateway/controllers/order/order';
import {paymentControllers} from '@gateway/controllers/order/payment';
import express, { Router } from 'express';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/orders',orderControllers.prototype.create);
    this.router.get('/orders/:orderId', orderControllers.prototype.read);
    this.router.get('/orders/user/:userId', orderControllers.prototype.readbyId);
    this.router.put('/orders/:orderId', orderControllers.prototype.update);
    this.router.delete('/orders/:orderId', orderControllers.prototype.delete);
    // payment 
    this.router.post('/payments', paymentControllers.prototype.create);
    this.router.get('/payments/:paymentId', paymentControllers.prototype.read);
    this.router.put('/payments/:paymentId', paymentControllers.prototype.update);
    this.router.delete('/payments/:paymentId', paymentControllers.prototype.delete);
    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
