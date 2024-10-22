import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {gatewayCache} from '@gateway/redis/gateway.cache';
import { IAuthDocument } from '@theshreyashguy/coffee-shared';
import { omit } from 'lodash';

export class SignUp {
  public async create(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signUp(req.body);
    req.session = { jwt: response.data.token };
    gatewayCache.saveUserInfoToCache(response.data.user.id,response.data.user,1200);
    const userData: IAuthDocument = omit(response.data.user, ['password']) as IAuthDocument;
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: userData });
  }
}
