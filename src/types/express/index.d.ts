import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: Pick<User, 'id' | 'email'> & JwtPayload;
    }
  }
}
