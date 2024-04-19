import { RequestHandler } from 'express';
import { ParamsDictionary as PD } from 'express-serve-static-core';
import prisma from '../db.js';
import { comparePasswords, hashPassword } from '../modules/password.js';
import { createToken } from '../modules/auth.js';
import { Prisma, User } from '@prisma/client';

export const createUser: RequestHandler<
  PD,
  any,
  Prisma.UserCreateInput
> = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: await hashPassword(req.body.password),
      },
    });
    console.log('prisma created');

    const token = createToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler<
  PD,
  any,
  Pick<User, 'email' | 'password'>
> = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(401).json({ message: `Email doesn't exist` });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    const token = createToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
