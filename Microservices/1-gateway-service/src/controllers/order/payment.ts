import { orderService } from '@gateway/services/api/order.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class paymentControllers {
  public async read(_req: Request, res: Response): Promise<void> {
    const { paymentId } = _req.params;
    const response: AxiosResponse = await orderService.getPayment(paymentId);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async create(_req: Request, res: Response): Promise<void> {
    const paymentData = _req.body;
    const response: AxiosResponse = await orderService.createPayment(paymentData);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async update(_req: Request, res: Response): Promise<void> {
    const { paymentId } = _req.params;
    const paymentData = _req.body;
    const response: AxiosResponse = await orderService.updatePayment(paymentId,paymentData);
    res.status(StatusCodes.OK).json(response.data);
  }
  public async delete(_req: Request, res: Response): Promise<void> {
    const { paymentId } = _req.params;
    const response: AxiosResponse = await orderService.deletePayment(paymentId);
    res.status(StatusCodes.OK).json(response.data);
  }
}
