// import { authService } from '@gateway/services/api/auth.service';
// import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {gatewayCache} from '@gateway/redis/gateway.cache';
// import { IAuthDocument } from '@theshreyashguy/coffee-shared';
// import { omit } from 'lodash';


export class SignOut {
  public async remove(req: Request, res: Response): Promise<void> {
    const {id} =  req.body;
    gatewayCache.removeUserInfoFromCache(id);
    // const userdata: IAuthDocument = omit(response.data.user, ['password']) as IAuthDocument; 
    let message = 'User login out successfully';   
    res.status(StatusCodes.OK).json({ message });
  }
}
