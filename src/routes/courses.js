import express from 'express';
import { Auth } from '../middleware';
import { Course } from '../controllers';

const coursesRouter = express.Router();

coursesRouter.get('/', Auth.verifyAdmin, Course.getCourses);
/**
 * add the create course endpoint
 */
coursesRouter.post('/', Auth.verifyAdmin, Course.create);
/**
 * add the update course endpoint
 */
coursesRouter.post('/:id', Auth.verifyAdmin, Course.update);
/**
 * add the create course endpoint
 */
coursesRouter.post('/login', Auth.verifyAdmin, Course.login);

export default coursesRouter;
