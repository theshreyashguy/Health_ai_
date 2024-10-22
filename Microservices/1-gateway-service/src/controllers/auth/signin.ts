import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {gatewayCache} from '@gateway/redis/gateway.cache';
import { IAuthDocument } from '@theshreyashguy/coffee-shared';
import { omit } from 'lodash';


export class SignIn {
  public async read(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signIn(req.body);
    const { message, user } = response.data;
    gatewayCache.saveUserInfoToCache(user.id,user,1200);
    const userdata: IAuthDocument = omit(response.data.user, ['password']) as IAuthDocument;    
    res.status(StatusCodes.OK).json({ message, userdata });
  }
}
