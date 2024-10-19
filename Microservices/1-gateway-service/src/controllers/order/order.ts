import { orderService } from '@gateway/services/api/order.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class orderControllers {
  public async read(_req: Request, res: Response): Promise<void> {
    const { orderId } = _req.params;
    const response: AxiosResponse = await orderService.getOrder(orderId);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async create(_req: Request, res: Response): Promise<void> {
    const orderData = _req.body;
    const response: AxiosResponse = await orderService.createOrder(orderData);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async update(_req: Request, res: Response): Promise<void> {
    const { orderId } = _req.params;
      const updateData = _req.body;
    const response: AxiosResponse = await orderService.updateOrder(orderId,updateData);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async readbyId(_req: Request, res: Response): Promise<void> {
    const { userId } = _req.params;
    const response: AxiosResponse = await orderService.getOrdersUser(userId);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async delete(_req: Request, res: Response): Promise<void> {
    const { orderId } = _req.params;
    const response: AxiosResponse = await orderService.deleteOrder(orderId);
    res.status(StatusCodes.OK).json(response.data);

  }
}
