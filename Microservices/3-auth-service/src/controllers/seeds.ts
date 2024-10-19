import {createAuthUser , getUserByUsernameOrEmail } from '@auth/services/auth.service';
import { faker } from '@faker-js/faker';
import { BadRequestError, IAuthDocument, firstLetterUppercase, lowerCase } from '@theshreyashguy/coffee-shared';
import { Request, Response } from 'express';
import { generateUsername } from 'unique-username-generator';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  const { count } = req.params;
  const usernames: string[] = [];
  for(let i = 0; i < parseInt(count, 10); i++) {
    const username: string = generateUsername('', 0, 12);
    usernames.push(firstLetterUppercase(username));
  }

  for(let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const email = faker.internet.email();
    const phone = faker.phone.number();
    const password = 'qwerty';
    const checkIfUserExist: IAuthDocument | undefined = await getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials. Email or Username', 'Seed create() method error');
    }

    const authData: IAuthDocument = {
      username: firstLetterUppercase(username),
      email: lowerCase(email),
      phone,
      password,
    } as IAuthDocument;
    await createAuthUser(authData,'');
  }
  res.status(StatusCodes.OK).json({ message: 'Seed users created successfully.' });
}
