import { signupSchema } from '@auth/schemes/signup';
import { createAuthUser, getUserByUsernameOrEmail } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, firstLetterUppercase, lowerCase } from '@theshreyashguy/coffee-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
  }
  const { username, email, phone, password ,token } = req.body;
  const checkIfUserExist: IAuthDocument | undefined = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
  }
  const authData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    phone: phone,
    password
  } as IAuthDocument;
  const result: IAuthDocument = await createAuthUser(authData , token) as IAuthDocument;
  // await publishDirectMessage(
  //   authChannel,
  //   'coffee-email-notification',
  //   'coffee-email',
  //   `hello ${username}`,
  //   `hello ${username}`
  // );
  res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: result });
}
