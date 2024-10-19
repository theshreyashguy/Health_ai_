import { config } from '@auth/config';
import { AuthModel } from '@auth/models/auth.schema';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import {  IAuthDocument, IEmailLocals, firstLetterUppercase, lowerCase, winstonLogger } from '@theshreyashguy/coffee-shared';
import { omit } from 'lodash';
import {  Model, Op } from 'sequelize';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

interface IAuthBuyerMessageDetails{
    username?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    type?: string;
  
}

export async function createAuthUser(data: IAuthDocument , token : string): Promise<IAuthDocument | undefined> {
  try {
    const result: Model = await AuthModel.create(data);
    const messageDetails: IAuthBuyerMessageDetails = {
      username: result.dataValues.username!,
      email: result.dataValues.email!,
      phone: result.dataValues.phone!, 
      createdAt: result.dataValues.createdAt!,
      type: 'auth'
    };
    const message : IEmailLocals = {
      title :`Hello ${result.dataValues.username}`,
      message:JSON.stringify(messageDetails),
      token:token,
    }
    await publishDirectMessage(
      authChannel,
      'coffee-push-notification',
      'auth-email',
      JSON.stringify(message),
      'user details sent to notification service.'
    );
    const userData: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;
    return userData;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserById(authId: number): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { id: authId },
      attributes: {
        exclude: ['password']
      }
    }) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: {
        [Op.or]: [{ username: firstLetterUppercase(username)}, { email: lowerCase(email)}]
      },
    }) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsername(username: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { username: firstLetterUppercase(username) },
    }) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = await AuthModel.findOne({
      where: { email: lowerCase(email) },
    }) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}
