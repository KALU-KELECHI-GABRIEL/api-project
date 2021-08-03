import express from 'express';
import { Auth } from '../middleware';
import { User } from '../controllers';

const usersRouter = express.Router();

usersRouter.get('/', Auth.verifyAdmin, User.getUsers);
/**
 * add the create user endpoint
 */
usersRouter.post('/', User.create);
/**
 * add the create user endpoint
 */
usersRouter.post('/login', User.login);

export default usersRouter;
