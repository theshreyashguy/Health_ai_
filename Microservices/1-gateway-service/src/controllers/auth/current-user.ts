import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {gatewayCache} from '@gateway/redis/gateway.cache';
export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    const userdata = gatewayCache.getUserInfoFromCache(req.params.id);
    userdata.then((data)=>{
      if(data === null){
        res.status(StatusCodes.NOT_FOUND).json({ message: 'data not found' });
        return;
      }
      let message = 'User data send successfully';
       res.status(StatusCodes.OK).json({ message: message, user: JSON.parse(data) });
    }).catch((error)=>{
      res.status(StatusCodes.NOT_FOUND).json({ message: error });
    })
  }
}
