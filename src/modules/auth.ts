import { RequestHandler } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { User } from '@prisma/client';

export const createToken = (user: User) => {
  const { id, email } = user;
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET as Secret);
  return token;
};

export const protect: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization;
  // JWT is stored in this header

  if (!bearer) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const token = bearer.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as Secret);
    req.user = user as Pick<User, 'id' | 'email'> & JwtPayload;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};
